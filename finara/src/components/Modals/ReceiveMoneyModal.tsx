import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Copy, Check, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiveMoneyModal: React.FC<ReceiveMoneyModalProps> = ({ isOpen, onClose }) => {
  const { user, receiveMoney } = useAuth();
  const [copied, setCopied] = useState(false);
  const [simulatedAmount, setSimulatedAmount] = useState('500');

  if (!isOpen || !user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(user.iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDeposit = () => {
    const num = parseFloat(simulatedAmount);
    if (!isNaN(num) && num > 0) {
      receiveMoney('External Bank Deposit', num);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-black shadow-2xl relative border border-[#EBEBEB] space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-[#FFFF00]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-geist text-black">Receive Funds</h3>
              <p className="text-xs text-[#707070] font-mono">Your Account Deposit Details</p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-6 bg-[#F7F6F5] rounded-2xl text-center space-y-3 border border-[#DEDEDE]">
            <div className="w-36 h-36 bg-black p-3 rounded-xl mx-auto flex items-center justify-center text-white font-mono text-[10px] text-center shadow-md">
              <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-white rounded">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`rounded-xs ${i % 2 === 0 ? 'bg-black' : 'bg-[#FFFF00]'}`} />
                ))}
              </div>
            </div>
            <p className="text-xs font-mono text-[#707070]">Scan QR code to transfer instantly</p>
          </div>

          {/* Account Details */}
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 bg-[#F7F6F5] rounded-xl flex items-center justify-between border border-[#DEDEDE]">
              <div>
                <span className="text-[#707070] block text-[10px] uppercase">IBAN / Account Number</span>
                <span className="font-bold text-black text-sm">{user.iban}</span>
              </div>
              <button
                onClick={handleCopy}
                className="p-2 bg-black text-[#FFFF00] rounded-lg hover:bg-neutral-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-[#16BD00]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Simulate External Deposit Button */}
          <div className="pt-2 space-y-2 border-t border-neutral-100">
            <span className="text-[11px] font-mono text-[#707070] uppercase block">Test Deposit Simulator</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={simulatedAmount}
                onChange={(e) => setSimulatedAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F7F6F5] border border-[#DEDEDE] rounded-xl text-xs font-mono font-bold"
                placeholder="Deposit Amount"
              />
              <button
                onClick={handleSimulateDeposit}
                className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-[#FFFF00] font-bold text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Simulate Deposit</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
