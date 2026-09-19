import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ isOpen, onClose }) => {
  const { user, sendMoney } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    if (user && user.balances[currency] < numAmount) {
      setError(`Insufficient ${currency} balance.`);
      return;
    }

    const ok = sendMoney(recipient, numAmount, currency);
    if (ok) {
      setSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000000', '#FFFF00', '#16BD00'],
      });
      setTimeout(() => {
        setSuccess(false);
        setRecipient('');
        setAmount('');
        onClose();
      }, 2000);
    } else {
      setError('Transfer failed. Check your balance.');
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
            <div className="w-10 h-10 rounded-2xl bg-[#FFFF00] flex items-center justify-center text-black">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-geist text-black">Send Funds</h3>
              <p className="text-xs text-[#707070] font-mono">Zero-Fee Instant Transfer</p>
            </div>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#16BD00] mx-auto" />
              <h4 className="text-2xl font-bold text-black font-geist">Transfer Successful!</h4>
              <p className="text-sm text-[#707070]">
                Sent <span className="font-bold text-black">${amount}</span> to <span className="font-bold text-black">{recipient}</span>.
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
                <label className="text-xs font-mono font-bold uppercase text-[#707070]">Recipient (Name or IBAN)</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Sarah Mitchell or US89 FINR..."
                  required
                  className="w-full px-4 py-3 bg-[#F7F6F5] border border-[#DEDEDE] rounded-xl text-sm font-geist focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono font-bold uppercase text-[#707070]">
                  <span>Amount</span>
                  <span>Balance: ${user?.balances[currency].toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full px-4 py-3 bg-[#F7F6F5] border border-[#DEDEDE] rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-black"
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="px-3 py-3 bg-[#F7F6F5] border border-[#DEDEDE] rounded-xl text-xs font-mono font-bold focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#F7F6F5] rounded-xl text-xs font-mono text-[#707070] space-y-1">
                <div className="flex justify-between">
                  <span>Transfer Fee:</span>
                  <span className="text-[#16BD00] font-bold">FREE (0%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement:</span>
                  <span className="text-black font-bold">Instant (&lt; 3s)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <span>Confirm Send</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
