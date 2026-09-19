import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SendMoneyModal } from '../components/Modals/SendMoneyModal';
import { ReceiveMoneyModal } from '../components/Modals/ReceiveMoneyModal';
import { TransferModal } from '../components/Modals/TransferModal';
import { BuyStockModal } from '../components/Modals/BuyStockModal';
import { formatMoney } from '../lib/money';
import { issueVirtualCard, updateCardStatus, updateCardControls } from '../services/cards';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Wallet,
  ArrowLeftRight,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Sparkles,
  Plane,
  Home,
  GraduationCap,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  FileText,
  Download,
  KeyRound,
  HelpCircle,
  PiggyBank
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FinaraLogo } from '../components/FinaraLogo';

export const DashboardPage: React.FC = () => {
  const { user, isPlatformFrozen, logout } = useAuth();
  const navigate = useNavigate();

  type TabType = 'dashboard' | 'cards' | 'analytics' | 'wallet' | 'transactions' | 'savings' | 'kyc' | 'security' | 'support' | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [buyStockModalOpen, setBuyStockModalOpen] = useState(false);
  const [selectedAsset] = useState<{ symbol: string; name: string; price: number; change: string } | null>(null);

  // Interactive chart state
  const [hoveredMonth, setHoveredMonth] = useState<string | null>('Aug');
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<any | null>(null);

  // Card Controls state
  const [userCard, setUserCard] = useState(() => issueVirtualCard(user?.id || 'usr_101'));

  // Support Ticket local state
  const [supportTickets, setSupportTickets] = useState([
    { id: 'tkt_01', subject: 'Inbound EUR Transfer Clearing Time', status: 'Open', date: 'Yesterday' },
  ]);
  const [newTicketSubject, setNewTicketSubject] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const quickContacts = [
    { name: 'Alex', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'Elena', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
    { name: 'David', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { name: 'Chloe', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  ];

  const cashFlowData = [
    { month: 'Jan', val: 4200, height: '40%' },
    { month: 'Feb', val: 5800, height: '55%' },
    { month: 'Mar', val: 4900, height: '45%' },
    { month: 'Apr', val: 7200, height: '70%' },
    { month: 'May', val: 6100, height: '58%' },
    { month: 'Jun', val: 8100, height: '82%' },
    { month: 'Jul', val: 7400, height: '72%' },
    { month: 'Aug', val: 8689.20, height: '92%', active: true },
    { month: 'Sep', val: 6900, height: '65%' },
    { month: 'Oct', val: 7800, height: '75%' },
    { month: 'Nov', val: 8400, height: '85%' },
    { month: 'Dec', val: 9100, height: '95%' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'wallet', label: 'Wallets', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'savings', label: 'Savings Goals', icon: PiggyBank },
    { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck },
    { id: 'security', label: 'Security & MFA', icon: Lock },
    { id: 'support', label: 'Support & Help', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredTransactions = user.transactions.filter(tx =>
    tx.title.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
    tx.subtitle.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
    tx.amount.toString().includes(txSearchQuery)
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim()) return;
    setSupportTickets(prev => [
      { id: `tkt_${Date.now()}`, subject: newTicketSubject, status: 'Open', date: 'Just now' },
      ...prev,
    ]);
    setNewTicketSubject('');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F5] text-black font-geist flex flex-col md:flex-row">
      
      {/* ================= COLUMN 1: LEFT VERTICAL SIDEBAR ================= */}
      <aside className="w-full md:w-64 bg-white border-r border-[#EBEBEB] p-5 flex flex-col justify-between shrink-0 sticky top-0 h-auto md:h-screen z-40">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
              <FinaraLogo />
            </button>
            <span className="text-[10px] font-mono font-bold bg-[#FFFF00] text-black px-2 py-0.5 rounded-full uppercase">
              PRO 2.0
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl font-medium text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-[#FFFF00] font-bold shadow-sm'
                      : 'text-[#707070] hover:text-black hover:bg-[#F7F6F5]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFFF00]' : 'text-[#707070]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Summary */}
        <div className="pt-4 border-t border-[#EBEBEB] space-y-3">
          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-black text-[#FFFF00] font-bold text-xs rounded-xl hover:bg-neutral-800 transition-all shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FFFF00]" />
              <span>Admin Console</span>
            </button>
          )}

          <div className="p-3 bg-[#F7F6F5] rounded-2xl flex items-center justify-between border border-[#EBEBEB]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-black text-[#FFFF00] font-bold text-xs flex items-center justify-center font-mono shrink-0 shadow">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-black truncate">{user.name}</div>
                <div className="text-[10px] text-[#707070] font-mono truncate">{user.email}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-black transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#EBEBEB] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-black font-geist flex items-center gap-2">
              <span>Good morning, {user.name.split(' ')[0]}</span>
              <span className="animate-bounce inline-block">👋</span>
            </h1>
            <p className="text-xs text-[#707070] font-normal">
              Stay on top of your tasks and track your financial growth.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#707070] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transaction, stock..."
                value={txSearchQuery}
                onChange={(e) => setTxSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2 bg-[#F7F6F5] border border-[#EBEBEB] rounded-full text-xs font-geist text-black focus:outline-none focus:border-black transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#EBEBEB] text-[#707070]">
                ⌘K
              </span>
            </div>

            <button className="p-2.5 bg-[#F7F6F5] hover:bg-neutral-200 border border-[#EBEBEB] rounded-full text-black relative transition-all">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>

            <div className="w-9 h-9 rounded-full bg-black text-[#FFFF00] font-bold text-xs flex items-center justify-center border-2 border-[#FFFF00] shadow-sm font-mono">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="p-6 space-y-6">
          
          {/* Emergency Freeze Notice Banner */}
          {isPlatformFrozen && (
            <div className="p-4 bg-red-600 text-white rounded-2xl flex items-center justify-between font-mono text-xs font-bold animate-pulse shadow-md">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#FFFF00]" />
                <span>EMERGENCY SYSTEM MAINTENANCE ACTIVE — Financial transfers are temporarily paused by administrator.</span>
              </div>
            </div>
          )}

          {/* Account Suspended Notice Banner */}
          {user.accountStatus === 'Suspended' && (
            <div className="p-4 bg-amber-500 text-black rounded-2xl flex items-center justify-between font-mono text-xs font-bold shadow-md">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-black" />
                <span>ACCOUNT SUSPENDED — Your account is under compliance review. Contact support for assistance.</span>
              </div>
            </div>
          )}

          {/* TAB 1: MAIN DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Center Bento Content */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Smart Wallet Container */}
                <div className="bg-[#F7F6F5] p-6 rounded-3xl border border-[#EBEBEB] space-y-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-black text-[#FFFF00] flex items-center justify-center font-bold">
                        <Wallet className="w-5 h-5 text-[#FFFF00]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-lg text-black font-geist">Smart Wallet</h2>
                          <span className="text-[10px] font-mono font-bold bg-[#16BD00]/10 text-[#16BD00] px-2 py-0.5 rounded-full border border-[#16BD00]/20">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-[#707070]">Automated yield optimization active</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono text-[#707070]">Total Savings</div>
                      <div className="text-2xl font-bold font-mono text-black">
                        {formatMoney(user.balances.USD + 12819.25, 'USD')}
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 bg-white rounded-2xl border border-[#EBEBEB] space-y-2 hover:border-black transition-all">
                      <div className="flex items-center justify-between text-xs font-semibold text-black">
                        <span className="flex items-center gap-1.5"><Plane className="w-3.5 h-3.5 text-blue-500" /> Travel</span>
                        <span className="font-mono">$4,200.00</span>
                      </div>
                      <div className="w-full bg-[#F7F6F5] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-[#EBEBEB] space-y-2 hover:border-black transition-all">
                      <div className="flex items-center justify-between text-xs font-semibold text-black">
                        <span className="flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-emerald-500" /> Property</span>
                        <span className="font-mono">$11,500.00</span>
                      </div>
                      <div className="w-full bg-[#F7F6F5] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-[#EBEBEB] space-y-2 hover:border-black transition-all">
                      <div className="flex items-center justify-between text-xs font-semibold text-black">
                        <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-purple-500" /> Education</span>
                        <span className="font-mono">$4,120.00</span>
                      </div>
                      <div className="w-full bg-[#F7F6F5] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Bento Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-sm space-y-2 hover:border-black transition-all">
                    <div className="text-xs font-mono text-[#707070] flex items-center justify-between">
                      <span>Current Balance</span>
                      <span className="w-2 h-2 rounded-full bg-[#16BD00]"></span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-black">
                      {formatMoney(user.balances.USD, 'USD')}
                    </div>
                    <div className="text-[11px] font-mono text-[#16BD00] font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +34.5%
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-sm space-y-2 hover:border-black transition-all">
                    <div className="text-xs font-mono text-[#707070] flex items-center justify-between">
                      <span>Savings</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#FFFF00] fill-[#FFFF00]" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-black">
                      $5,300.50
                    </div>
                    <div className="text-[11px] font-mono text-[#16BD00] font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12.01%
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-sm space-y-2 hover:border-black transition-all">
                    <div className="text-xs font-mono text-[#707070] flex items-center justify-between">
                      <span>Income</span>
                      <ArrowDownLeft className="w-3.5 h-3.5 text-[#16BD00]" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-black">
                      $28,750.75
                    </div>
                    <div className="text-[11px] font-mono text-[#16BD00] font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +7.76%
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-sm space-y-2 hover:border-black transition-all">
                    <div className="text-xs font-mono text-[#707070] flex items-center justify-between">
                      <span>Expenses</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-black">
                      $21,450.00
                    </div>
                    <div className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                      ↓ -8.12%
                    </div>
                  </div>
                </div>

                {/* Cash Flow Chart */}
                <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-black font-geist">Cash Flow Overview</h3>
                      <p className="text-xs text-[#707070]">Yearly volume analysis & real-time analytics</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-mono text-[#707070]">Total Volume</span>
                        <div className="text-sm font-bold font-mono text-black">$342,323.44</div>
                      </div>
                      <button className="px-3 py-1.5 bg-[#F7F6F5] border border-[#EBEBEB] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition-all">
                        <span>2026 / Yearly</span>
                        <ChevronDown className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 pb-2">
                    <div className="h-52 flex items-end justify-between gap-1 sm:gap-3 px-2 relative border-b border-[#EBEBEB]">
                      {cashFlowData.map((item) => {
                        const isHovered = hoveredMonth === item.month;
                        return (
                          <div
                            key={item.month}
                            onMouseEnter={() => setHoveredMonth(item.month)}
                            className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative h-full justify-end"
                          >
                            {isHovered && (
                              <div className="absolute -top-10 bg-black text-[#FFFF00] font-mono text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-lg border border-[#FFFF00]/30 z-20 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                                ${item.val.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                            )}

                            <div className="w-full max-w-[28px] bg-[#F7F6F5] rounded-t-lg overflow-hidden h-full flex items-end">
                              <div
                                className={`w-full rounded-t-lg transition-all duration-300 ${
                                  isHovered || item.active
                                    ? 'bg-black shadow-[0_0_12px_rgba(255,255,0,0.5)]'
                                    : 'bg-[#DEDEDE] group-hover:bg-neutral-500'
                                }`}
                                style={{ height: item.height }}
                              ></div>
                            </div>

                            <span className={`text-[11px] font-mono transition-colors ${
                              isHovered || item.active ? 'font-bold text-black' : 'text-[#707070]'
                            }`}>
                              {item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Action Sidebar Panel */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Quick Send */}
                <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-black font-geist">Quick Send</h3>
                    <button onClick={() => setSendModalOpen(true)} className="text-xs font-mono text-[#707070] hover:text-black font-bold">
                      See all
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                    {quickContacts.map((contact, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSendModalOpen(true)}
                        className="flex flex-col items-center gap-1.5 group shrink-0"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-black transition-all shadow-sm">
                          <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-black group-hover:font-bold">{contact.name}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setSendModalOpen(true)}
                      className="flex flex-col items-center gap-1.5 shrink-0"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#F7F6F5] hover:bg-neutral-200 border border-dashed border-[#707070] flex items-center justify-center transition-all">
                        <Plus className="w-5 h-5 text-black" />
                      </div>
                      <span className="text-xs font-medium text-[#707070]">Add</span>
                    </button>
                  </div>
                </div>

                {/* Metallic Visa Card */}
                <div className="bg-gradient-to-br from-neutral-900 via-black to-neutral-800 text-white p-6 rounded-3xl shadow-xl border border-neutral-700 relative overflow-hidden space-y-8 group hover:scale-[1.01] transition-transform duration-300">
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#FFFF00]/10 rounded-full blur-2xl group-hover:bg-[#FFFF00]/20 transition-all"></div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FFFF00] text-black font-bold flex items-center justify-center font-mono text-xs">
                        F
                      </div>
                      <span className="font-bold text-sm tracking-wider font-geist text-white">Finara Premium</span>
                    </div>
                    <div className="text-neutral-400 font-mono text-xs">
                      VISA
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="w-10 h-8 bg-amber-400/80 rounded-md border border-amber-300/50 flex items-center justify-center shadow-inner">
                      <div className="w-6 h-5 border border-amber-600/40 rounded-sm"></div>
                    </div>

                    <div className="text-lg font-mono tracking-widest text-neutral-200 font-medium">
                      {userCard.maskedPan}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 relative z-10 pt-2 border-t border-neutral-800">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">CARD HOLDER</div>
                      <div className="font-bold text-white font-geist uppercase">{user.name}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">EXPIRES</div>
                      <div className="font-bold text-white">{userCard.exp}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setReceiveModalOpen(true)}
                    className="py-3.5 px-4 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <ArrowDownLeft className="w-4 h-4 text-black" />
                    <span>Deposit</span>
                  </button>

                  <button
                    onClick={() => setTransferModalOpen(true)}
                    className="py-3.5 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <ArrowUpRight className="w-4 h-4 text-[#FFFF00]" />
                    <span>Transfer</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: CARDS MANAGEMENT MODULE */}
          {activeTab === 'cards' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-bold text-black font-geist">Finara Card Controls & Security</h2>
                  <p className="text-xs text-[#707070]">Manage your virtual Visa card, freeze spending, or edit PIN limits</p>
                </div>
                <button
                  onClick={() => setUserCard(prev => updateCardStatus(prev, prev.status === 'active' ? 'frozen' : 'active'))}
                  className={`px-4 py-2 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                    userCard.status === 'frozen' ? 'bg-[#16BD00] text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {userCard.status === 'frozen' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{userCard.status === 'frozen' ? 'Unfreeze Card' : 'Freeze Card'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-black text-white rounded-3xl space-y-6 border border-neutral-800 shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-[#FFFF00]">● {userCard.status.toUpperCase()}</span>
                    <span className="font-bold text-sm">VISA</span>
                  </div>
                  <div className="text-xl font-mono tracking-widest">{userCard.maskedPan}</div>
                  <div className="flex justify-between text-xs font-mono text-neutral-400">
                    <div>HOLDERS: {user.name}</div>
                    <div>EXP: {userCard.exp}</div>
                  </div>
                </div>

                <div className="space-y-4 font-geist">
                  <div className="p-4 bg-[#F7F6F5] rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-black">Online Payments</div>
                      <div className="text-xs text-[#707070]">Allow e-commerce & digital subscriptions</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={userCard.controls.allowOnline}
                      onChange={(e) => setUserCard(prev => updateCardControls(prev, { allowOnline: e.target.checked }))}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-[#F7F6F5] rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-black">ATM Cash Withdrawals</div>
                      <div className="text-xs text-[#707070]">Enable physical ATM cash access</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={userCard.controls.allowAtm}
                      onChange={(e) => setUserCard(prev => updateCardControls(prev, { allowAtm: e.target.checked }))}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-[#F7F6F5] rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-black">Contactless Tap & Pay</div>
                      <div className="text-xs text-[#707070]">Enable NFC POS contactless terminal tap</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={userCard.controls.allowContactless}
                      onChange={(e) => setUserCard(prev => updateCardControls(prev, { allowContactless: e.target.checked }))}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS EXPLORER MODULE */}
          {activeTab === 'transactions' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-bold text-black font-geist">Transaction Explorer & Ledger</h2>
                  <p className="text-xs text-[#707070]">View historical ledger records, download receipts & inspect statuses</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#FFFF00] text-black px-3 py-1 rounded-full">
                  {filteredTransactions.length} Transactions Found
                </span>
              </div>

              <div className="space-y-3">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 bg-[#F7F6F5] rounded-2xl border border-[#EBEBEB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-black text-[#FFFF00] font-bold text-xs flex items-center justify-center">
                        {tx.type === 'receive' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-black font-geist">{tx.title}</div>
                        <div className="text-xs text-[#707070] font-mono">{tx.subtitle} • {tx.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-sm font-mono text-black">
                          {tx.type === 'receive' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#16BD00]">
                          <CheckCircle2 className="w-3 h-3" /> {tx.status}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedReceiptTx(tx)}
                        title="View Official PDF Receipt"
                        className="px-3 py-1.5 bg-white border border-[#EBEBEB] hover:border-black rounded-xl text-xs font-mono font-bold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedReceiptTx && (
                <div className="p-6 bg-white border-2 border-black rounded-3xl space-y-4 shadow-2xl animate-in fade-in duration-200">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                    <FinaraLogo />
                    <span className="font-mono text-xs text-[#16BD00] font-bold">OFFICIAL TRANSACTION RECEIPT</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs text-neutral-800">
                    <div>Reference ID: {selectedReceiptTx.id}</div>
                    <div>Date: {selectedReceiptTx.date}</div>
                    <div>Description: {selectedReceiptTx.title} ({selectedReceiptTx.subtitle})</div>
                    <div className="text-lg font-bold text-black pt-2 border-t border-neutral-100">
                      Amount: ${selectedReceiptTx.amount.toFixed(2)} {selectedReceiptTx.currency}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => alert('Official PDF receipt downloaded successfully.')}
                      className="px-4 py-2 bg-black text-[#FFFF00] font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Receipt PDF</span>
                    </button>
                    <button
                      onClick={() => setSelectedReceiptTx(null)}
                      className="px-4 py-2 bg-neutral-200 text-black font-bold text-xs rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KYC VERIFICATION MODULE */}
          {activeTab === 'kyc' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-bold text-black font-geist">KYC Identity Verification Portal</h2>
                  <p className="text-xs text-[#707070]">Verify identity documentation to unlock unlimited global transaction limits</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#16BD00]/10 text-[#16BD00] px-3 py-1 rounded-full border border-[#16BD00]/30">
                  {user.accountStatus}
                </span>
              </div>

              <div className="p-6 bg-[#F7F6F5] rounded-3xl space-y-4 border border-[#EBEBEB]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#16BD00]" />
                  <div>
                    <div className="font-bold text-base text-black">KYC Status: Fully Verified (Level 2)</div>
                    <div className="text-xs text-[#707070]">Passport & proof of address verified on file. Private Storage Bucket Encrypted.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & MFA MODULE */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-bold text-black font-geist">Security & Multi-Factor Authentication</h2>
                  <p className="text-xs text-[#707070]">Manage your 2FA security tokens, password & trusted device sessions</p>
                </div>
                <span className="text-xs font-mono font-bold bg-black text-[#FFFF00] px-3 py-1 rounded-full">
                  MFA Enrolled
                </span>
              </div>

              <div className="space-y-4 font-geist">
                <div className="p-4 bg-[#F7F6F5] rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-black flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#16BD00]" />
                      <span>Two-Factor Authentication (TOTP 2FA)</span>
                    </div>
                    <div className="text-xs text-[#707070]">Requires authenticator code for transfer execution</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#16BD00]">ACTIVE</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SUPPORT & TICKETING MODULE */}
          {activeTab === 'support' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-bold text-black font-geist">Help & Customer Support Desk</h2>
                  <p className="text-xs text-[#707070]">Open a priority ticket with compliance or customer finance support</p>
                </div>
              </div>

              <form onSubmit={handleCreateTicket} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your support request or question..."
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-[#F7F6F5] border border-[#EBEBEB] rounded-xl text-xs font-geist text-black focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black text-[#FFFF00] font-bold text-xs rounded-xl hover:bg-neutral-800"
                >
                  Create Ticket
                </button>
              </form>

              <div className="space-y-2">
                {supportTickets.map((tkt) => (
                  <div key={tkt.id} className="p-4 bg-[#F7F6F5] rounded-2xl border border-[#EBEBEB] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-black">{tkt.subject}</div>
                      <div className="text-[#707070] font-mono">{tkt.id} • {tkt.date}</div>
                    </div>
                    <span className="font-mono font-bold text-[#16BD00]">● {tkt.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Action Modals */}
      <SendMoneyModal isOpen={sendModalOpen} onClose={() => setSendModalOpen(false)} />
      <ReceiveMoneyModal isOpen={receiveModalOpen} onClose={() => setReceiveModalOpen(false)} />
      <TransferModal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} />
      <BuyStockModal isOpen={buyStockModalOpen} onClose={() => setBuyStockModalOpen(false)} asset={selectedAsset} />
    </div>
  );
};
