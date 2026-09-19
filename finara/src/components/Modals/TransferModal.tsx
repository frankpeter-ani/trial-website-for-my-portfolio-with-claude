import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { user, transferFunds } = useAuth();
  const [fromCurr, setFromCurr] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [toCurr, setToCurr] = useState<'USD' | 'EUR' | 'GBP'>('EUR');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const num = parseFloat(amount);

    if (isNaN(num) || num <= 0) {
      setError('Enter a valid transfer amount.');
      return;
    }

    if (fromCurr === toCurr) {
      setError('Please choose two different currencies.');
      return;
    }

    const ok = transferFunds(fromCurr, toCurr, num);
    if (ok) {
      setSuccess(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        onClose();
      }, 2000);
    } else {
      setError(`Insufficient ${fromCurr} balance.`);
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
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-geist text-black">Currency Exchange</h3>
              <p className="text-xs text-[#707070] font-mono">Convert Between Currency Wallets</p>
            </div>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#16BD00] mx-auto" />
              <h4 className="text-2xl font-bold text-black font-geist">Exchange Complete!</h4>
              <p className="text-sm text-[#707070]">
                Converted {amount} {fromCurr} to {toCurr}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#707070] uppercase">From Currency</label>
                  <select
                    value={fromCurr}
                    onChange={(e) => setFromCurr(e.target.value as any)}
                    className="w-full px-3 py-3 bg-[#F7F6F5] border border-[#DEDEDE] rounded-xl text-xs font-mono font-bold"
                  >
                    <option value="USD">USD (${user.balances.USD.toFixed(2)})</option>
                    <option value="EUR">EUR (€{user.balances.EUR.toFixed(2)})</option>
                    <option value="GBP">GBP (£{user.balances.GBP.toFixed(2)})</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#707070] uppercase">To Currency</label>
                  <select
                    value={toCurr}
                    onChange={(e) => setToCurr(e.target.value as any)}
                    className="w-full px-3 py-3 bg-[#F7F6F5] border border-[#DEDEDE] rounded-xl text-xs font-mono font-bold"
                  >
                    <option value="EUR">EUR (€{user.balances.EUR.toFixed(2)})</option>
                    <option value="USD">USD (${user.balances.USD.toFixed(2)})</option>
                    <option value="GBP">GBP (£{user.balances.GBP.toFixed(2)})</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-[#707070]">Amount to Convert</label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full px-4 py-3 bg-[#F7F6F5] border border-[#DEDEDE] rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-black"
                />
              </div>

              <div className="p-3 bg-[#F7F6F5] rounded-xl text-xs font-mono text-[#707070] space-y-1">
                <div className="flex justify-between">
                  <span>Exchange Rate:</span>
                  <span className="text-black font-bold">Mid-Market Real-Time</span>
                </div>
                <div className="flex justify-between">
                  <span>Markup Fee:</span>
                  <span className="text-[#16BD00] font-bold">0.00%</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <span>Execute Conversion</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
