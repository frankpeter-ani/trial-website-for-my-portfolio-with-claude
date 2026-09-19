import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, CheckCircle2, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface StockAsset {
  symbol: string;
  name: string;
  price: number;
  change: string;
}

interface BuyStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: StockAsset | null;
}

export const BuyStockModal: React.FC<BuyStockModalProps> = ({ isOpen, onClose, asset }) => {
  const { user, buyStock, sellStock } = useAuth();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState('1');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !asset || !user) return null;

  const numShares = parseFloat(shares) || 0;
  const totalCost = numShares * asset.price;

  const userHolding = user.stocks.find(s => s.symbol === asset.symbol);
  const ownedShares = userHolding ? userHolding.shares : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (numShares <= 0) {
      setError('Enter a valid quantity.');
      return;
    }

    if (mode === 'buy') {
      if (user.balances.USD < totalCost) {
        setError('Insufficient USD cash balance.');
        return;
      }
      const ok = buyStock(asset.symbol, asset.name, numShares, asset.price);
      if (ok) {
        setSuccess(true);
        confetti({ particleCount: 80, spread: 70 });
        setTimeout(() => { setSuccess(false); onClose(); }, 2000);
      }
    } else {
      if (ownedShares < numShares) {
        setError(`You only own ${ownedShares} shares.`);
        return;
      }
      const ok = sellStock(asset.symbol, numShares, asset.price);
      if (ok) {
        setSuccess(true);
        setTimeout(() => { setSuccess(false); onClose(); }, 2000);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-black shadow-2xl relative border border-[#EBEBEB]"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pb-6 border-b border-neutral-100">
            <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-[#FFFF00]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-geist text-black">{asset.name} ({asset.symbol})</h3>
              <p className="text-xs text-[#707070] font-mono">
                Price: <span className="font-bold text-black">${asset.price.toFixed(2)}</span> ({asset.change})
              </p>
            </div>
          </div>

          {/* Buy / Sell Mode Toggle */}
          <div className="mt-4 flex bg-[#F7F6F5] p-1.5 rounded-xl border border-[#DEDEDE]">
            <button
              onClick={() => setMode('buy')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'buy' ? 'bg-[#FFFF00] text-black shadow-sm' : 'text-[#707070]'
              }`}
            >
              Buy Asset
            </button>
            <button
              onClick={() => setMode('sell')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'sell' ? 'bg-black text-white shadow-sm' : 'text-[#707070]'
              }`}
            >
              Sell Asset (Owned: {ownedShares})
            </button>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#16BD00] mx-auto" />
              <h4 className="text-2xl font-bold text-black font-geist">Order Executed!</h4>
              <p className="text-sm text-[#707070]">
                {mode === 'buy' ? 'Bought' : 'Sold'} {shares} {asset.symbol} @ ${asset.price.toFixed(2)}/share.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-[#707070]">Quantity / Shares</label>
                <input
                  type="number"
                  step="any"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="1"
                  required
                  className="w-full px-4 py-3 bg-[#F7F6F5] border border-[#DEDEDE] rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-black"
                />
              </div>

              <div className="p-4 bg-[#F7F6F5] rounded-xl text-xs font-mono text-[#707070] space-y-2 border border-[#DEDEDE]">
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span className="font-bold text-black">${asset.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trading Fee:</span>
                  <span className="text-[#16BD00] font-bold">0.00% (Zero Commission)</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-2 text-sm">
                  <span className="font-bold text-black">Total Order Value:</span>
                  <span className="font-bold text-black font-mono">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md ${
                  mode === 'buy' ? 'bg-[#FFFF00] text-black hover:bg-[#E6E600]' : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Execute {mode === 'buy' ? 'Purchase' : 'Sale'} Order</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
