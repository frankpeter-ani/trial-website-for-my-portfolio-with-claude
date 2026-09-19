import React, { useState } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [currency, setCurrency] = useState<'EUR' | 'GBP' | 'JPY'>('EUR');

  const rates = {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 147.2,
  };

  const converted = (amount * rates[currency]).toFixed(2);
  const bankFee = (amount * 0.045).toFixed(2); // 4.5% traditional bank hidden markup
  const finaraSavings = bankFee;

  return (
    <div className="pt-32 pb-24 bg-[#F7F6F5] min-h-screen text-[#000000] font-geist">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="finara-eyebrow">
            <div className="finara-eyebrow-dots">
              <span className="finara-eyebrow-dot-1" />
              <span className="finara-eyebrow-dot-2" />
            </div>
            <span>PLATFORM CAPABILITIES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-black tracking-[-0.03em] leading-[1.05em]">
            Supercharged AI Financial Engine
          </h1>

          <p className="text-lg sm:text-xl text-[#707070] font-normal leading-relaxed">
            Every tool you need to send, track, and optimize your wealth automatically across 150+ countries.
          </p>
        </div>

        {/* Interactive Instant Transfer & Fee Calculator */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#EBEBEB] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-black bg-[#FFFF00] px-3 py-1 rounded-full">
              Live Currency Calculator
            </span>
            <h2 className="text-3xl font-bold text-black tracking-tight">
              Instant Global Transfers with Zero Markup
            </h2>
            <p className="text-sm text-[#707070] leading-relaxed">
              Traditional banks charge up to 4.5% in hidden exchange rate markups. Finara uses real mid-market exchange rates powered by AI liquidity routing.
            </p>

            <div className="p-4 bg-[#F7F6F5] rounded-xl border border-neutral-200 space-y-2">
              <div className="flex justify-between text-xs font-mono text-[#707070]">
                <span>Finara Transfer Markup</span>
                <span className="text-[#16BD00] font-bold">0.00% (Mid-Market)</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-[#707070]">
                <span>Estimated Money Saved</span>
                <span className="text-black font-bold font-mono">${finaraSavings}</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator UI */}
          <div className="p-6 bg-black text-white rounded-2xl space-y-6 shadow-xl border border-neutral-800">
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase">You Send (USD)</label>
              <div className="flex items-center bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-700">
                <span className="text-xl font-bold font-mono text-white">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-transparent text-xl font-bold font-mono text-white focus:outline-none pl-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="h-px bg-neutral-800 flex-1" />
              <span className="px-3 py-1 bg-neutral-800 rounded-full text-[10px] font-mono text-[#FFFF00]">
                1 USD = {rates[currency]} {currency}
              </span>
              <div className="h-px bg-neutral-800 flex-1" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase">
                <span>Recipient Gets</span>
                <div className="flex items-center gap-2">
                  {(['EUR', 'GBP', 'JPY'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${currency === c ? 'bg-[#FFFF00] text-black font-bold' : 'bg-neutral-800 text-neutral-400'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-700">
                <div className="text-2xl font-bold font-mono text-[#FFFF00]">
                  {converted} {currency}
                </div>
              </div>
            </div>

            <Link
              to="/waitlist"
              className="w-full py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-sm rounded-xl transition-all text-center block"
            >
              Transfer Now with Finara
            </Link>
          </div>
        </div>

        {/* Feature Matrix / Comparison Table */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Finara vs Legacy Banks
            </h2>
            <p className="text-base text-[#707070]">
              See how our autonomous AI platform outperforms legacy banking networks.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F7F6F5] text-xs font-mono uppercase text-[#707070]">
                  <th className="p-4 sm:p-6">Feature</th>
                  <th className="p-4 sm:p-6 text-center text-black font-bold bg-[#FFFF00]/40">Finara AI</th>
                  <th className="p-4 sm:p-6 text-center">Traditional Banks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB] text-sm font-geist">
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-black">Transfer Speed</td>
                  <td className="p-4 sm:p-6 text-center font-bold text-[#16BD00] bg-[#FFFF00]/10">Instant (&lt; 3 sec)</td>
                  <td className="p-4 sm:p-6 text-center text-[#707070]">3 – 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-black">FX Markup Fee</td>
                  <td className="p-4 sm:p-6 text-center font-bold text-[#16BD00] bg-[#FFFF00]/10">0.00% (Mid-Market)</td>
                  <td className="p-4 sm:p-6 text-center text-[#707070]">3.0% – 5.0% Markup</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-black">AI Cash Flow Prediction</td>
                  <td className="p-4 sm:p-6 text-center font-bold text-black bg-[#FFFF00]/10">
                    <Check className="w-5 h-5 mx-auto text-[#16BD00]" />
                  </td>
                  <td className="p-4 sm:p-6 text-center text-[#707070]">
                    <X className="w-5 h-5 mx-auto text-red-400" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-black">Multi-Currency Accounts</td>
                  <td className="p-4 sm:p-6 text-center font-bold text-black bg-[#FFFF00]/10">150+ Countries</td>
                  <td className="p-4 sm:p-6 text-center text-[#707070]">1 Single Currency</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-black">Automated Categorization</td>
                  <td className="p-4 sm:p-6 text-center font-bold text-black bg-[#FFFF00]/10">Real-time Machine Learning</td>
                  <td className="p-4 sm:p-6 text-center text-[#707070]">Manual Entry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="bg-black rounded-2xl p-10 sm:p-14 text-center text-white space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-bold font-geist tracking-tight text-white">
            Unlock the power of Finara AI today
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto">
            Get early access to smart liquidity, instant transfers, and zero-markup global payments.
          </p>
          <div className="pt-2">
            <Link
              to="/waitlist"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-black bg-[#FFFF00] hover:bg-[#E6E600] rounded-full transition-all shadow-lg active:scale-95"
            >
              <span>Join Priority Waitlist</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
