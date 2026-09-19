import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users,
  DollarSign,
  Search,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Edit3,
  AlertCircle,
  Activity,
  ArrowLeftRight,
  Trash2,
  Lock,
  Unlock,
  Coins,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FinaraLogo } from '../components/FinaraLogo';

export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    allUsers,
    auditLogs,
    isPlatformFrozen,
    adminUpdateUserStatus,
    adminAdjustBalance,
    adminDeleteUser,
    adminApproveTransaction,
    adminFlagTransaction,
    adminRefundTransaction,
    adminGrantStockAllocation,
    adminTogglePlatformFreeze,
    logout
  } = useAuth();
  
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'portfolio' | 'audit'>('overview');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [newBalance, setNewBalance] = useState<string>('35000');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Grant stock modal state
  const [grantStockUserId, setGrantStockUserId] = useState<string | null>(null);
  const [grantSymbol, setGrantSymbol] = useState('NVDA');
  const [grantShares, setGrantShares] = useState('10');

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.iban.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Aggregate global transactions across all users
  const globalTransactions = allUsers.flatMap(u =>
    u.transactions.map(t => ({ ...t, userId: u.id, userName: u.name, userEmail: u.email }))
  );

  const totalUsdTreasury = allUsers.reduce((acc, u) => acc + u.balances.USD, 0);
  const totalEurTreasury = allUsers.reduce((acc, u) => acc + u.balances.EUR, 0);
  const totalGbpTreasury = allUsers.reduce((acc, u) => acc + u.balances.GBP, 0);

  const handleAdjustBalance = () => {
    if (!selectedUserId) return;
    const num = parseFloat(newBalance);
    if (!isNaN(num)) {
      adminAdjustBalance(selectedUserId, selectedCurrency, num);
      setSelectedUserId(null);
    }
  };

  const handleGrantStock = () => {
    if (!grantStockUserId) return;
    const sharesNum = parseFloat(grantShares);
    if (!isNaN(sharesNum) && sharesNum > 0) {
      const stockNames: Record<string, string> = {
        NVDA: 'NVIDIA Corp',
        AAPL: 'Apple Inc',
        TSLA: 'Tesla Inc',
        BTC: 'Bitcoin',
        ETH: 'Ethereum'
      };
      adminGrantStockAllocation(grantStockUserId, grantSymbol, stockNames[grantSymbol] || grantSymbol, sharesNum, 130);
      setGrantStockUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F5] text-black font-geist flex flex-col md:flex-row">
      
      {/* ================= COLUMN 1: LEFT SIDEBAR NAVIGATION ================= */}
      <aside className="w-full md:w-64 bg-white border-r border-[#EBEBEB] p-5 flex flex-col justify-between shrink-0 sticky top-0 h-auto md:h-screen z-40">
        <div className="space-y-8">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
              <FinaraLogo />
            </button>
            <span className="text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">
              ADMIN PRO
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === 'overview' ? 'bg-black text-[#FFFF00] shadow-sm' : 'text-[#707070] hover:text-black hover:bg-[#F7F6F5]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-[#FFFF00]" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                activeTab === 'users' ? 'bg-black text-[#FFFF00] font-bold shadow-sm' : 'text-[#707070] hover:text-black hover:bg-[#F7F6F5]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                activeTab === 'transactions' ? 'bg-black text-[#FFFF00] font-bold shadow-sm' : 'text-[#707070] hover:text-black hover:bg-[#F7F6F5]'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Global Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                activeTab === 'audit' ? 'bg-black text-[#FFFF00] font-bold shadow-sm' : 'text-[#707070] hover:text-black hover:bg-[#F7F6F5]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Security Logs</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm text-[#707070] hover:text-black hover:bg-[#F7F6F5] transition-all pt-4 border-t border-[#EBEBEB]"
            >
              <LayoutDashboard className="w-4 h-4 text-[#707070]" />
              <span>Customer Portal View</span>
            </button>
          </nav>
        </div>

        {/* Bottom Admin User Summary */}
        <div className="pt-6 border-t border-[#EBEBEB] space-y-3">
          <div className="p-3 bg-[#F7F6F5] rounded-2xl flex items-center justify-between border border-[#EBEBEB]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center font-mono shrink-0 shadow">
                SA
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-black truncate">{user.name}</div>
                <div className="text-[10px] text-red-600 font-mono font-bold truncate">Super Admin</div>
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-black font-geist">Platform Admin Control Suite</h1>
              {isPlatformFrozen && (
                <span className="text-[10px] font-mono font-bold bg-red-600 text-white px-2.5 py-0.5 rounded-full animate-pulse">
                  SYSTEM FROZEN
                </span>
              )}
            </div>
            <p className="text-xs text-[#707070]">
              Real-time user authorization, balances, transaction ledger & system controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#707070] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, email, IBAN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F7F6F5] border border-[#EBEBEB] rounded-full text-xs font-geist text-black focus:outline-none focus:border-black transition-all"
              />
            </div>

            {/* Emergency Freeze Button */}
            <button
              onClick={adminTogglePlatformFreeze}
              className={`px-4 py-2 font-bold text-xs rounded-full transition-all shadow-sm flex items-center gap-1.5 ${
                isPlatformFrozen
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isPlatformFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isPlatformFrozen ? 'Resume System' : 'Emergency Freeze'}</span>
            </button>
          </div>
        </header>

        {/* Workspace Main Section */}
        <main className="p-6 space-y-6">

          {/* Emergency Alert Banner if Frozen */}
          {isPlatformFrozen && (
            <div className="p-4 bg-red-600 text-white rounded-2xl flex items-center justify-between font-mono text-xs font-bold animate-bounce shadow-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#FFFF00]" />
                <span>EMERGENCY PLATFORM FREEZE IS ACTIVE — ALL CUSTOMER TRANSFERS ARE PAUSED</span>
              </div>
              <button
                onClick={adminTogglePlatformFreeze}
                className="px-3 py-1 bg-white text-black rounded-lg text-xs font-bold hover:bg-neutral-200"
              >
                Unfreeze Platform
              </button>
            </div>
          )}

          {/* VIEW 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Executive Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-white p-5 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-2 hover:border-black transition-all">
                  <div className="flex justify-between items-center text-xs font-mono text-[#707070]">
                    <span>USD TREASURY</span>
                    <DollarSign className="w-4 h-4 text-[#3546FC]" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-black">
                    ${totalUsdTreasury.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] font-mono text-[#16BD00] font-bold">+18.2% yield</div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-2 hover:border-black transition-all">
                  <div className="flex justify-between items-center text-xs font-mono text-[#707070]">
                    <span>REGISTERED ACCOUNTS</span>
                    <Users className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-black">{allUsers.length} Users</div>
                  <div className="text-[11px] font-mono text-[#16BD00] font-bold">100% Verified</div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-2 hover:border-black transition-all">
                  <div className="flex justify-between items-center text-xs font-mono text-[#707070]">
                    <span>EUR & GBP RESERVES</span>
                    <Coins className="w-4 h-4 text-[#16BD00]" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-black">
                    €{totalEurTreasury.toFixed(0)} / £{totalGbpTreasury.toFixed(0)}
                  </div>
                  <div className="text-[11px] font-mono text-black">Zero FX Fee</div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-2 hover:border-black transition-all">
                  <div className="flex justify-between items-center text-xs font-mono text-[#707070]">
                    <span>SECURITY HEALTH</span>
                    <Activity className="w-4 h-4 text-[#16BD00]" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#16BD00]">99.99%</div>
                  <div className="text-[11px] font-mono text-[#707070]">SOC2 Certified</div>
                </div>

              </div>

              {/* User Accounts Overview Table Shortcut */}
              <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h2 className="text-lg font-bold text-black font-geist">Platform Customer Accounts</h2>
                  <button onClick={() => setActiveTab('users')} className="text-xs font-mono font-bold text-[#3546FC] hover:underline">
                    Manage All Users ({allUsers.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="p-4 bg-[#F7F6F5] rounded-2xl border border-[#EBEBEB] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black text-[#FFFF00] font-bold text-xs flex items-center justify-center font-mono shadow">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-black font-geist">{u.name}</div>
                          <div className="text-xs text-[#707070] font-mono">{u.email}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-sm font-mono text-black">${u.balances.USD.toFixed(2)}</div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          u.accountStatus === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-[#16BD00]/10 text-[#16BD00]'
                        }`}>
                          {u.accountStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: USER ACCOUNT MANAGER */}
          {activeTab === 'users' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-bold text-black font-geist">Full User Account Management</h2>
                  <p className="text-xs text-[#707070]">Modify user status, adjust currency balances & manage user privileges</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#FFFF00] text-black px-3 py-1 rounded-full border border-yellow-300">
                  {allUsers.length} Accounts Registered
                </span>
              </div>

              {/* Accounts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-geist">
                  <thead>
                    <tr className="border-b border-[#EBEBEB] bg-[#F7F6F5] text-[11px] font-mono uppercase text-[#707070]">
                      <th className="p-4 rounded-l-xl">User Profile</th>
                      <th className="p-4">IBAN</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Balances (USD / EUR / GBP)</th>
                      <th className="p-4 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBEB] text-sm">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-black text-[#FFFF00] font-bold text-xs flex items-center justify-center font-mono">
                              {u.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-black text-sm">{u.name}</div>
                              <div className="text-xs text-[#707070] font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-xs text-neutral-600">
                          {u.iban}
                        </td>

                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                            u.accountStatus === 'Suspended'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-[#16BD00]/10 text-[#16BD00] border border-[#16BD00]/20'
                          }`}>
                            {u.accountStatus === 'Suspended' ? <AlertCircle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                            {u.accountStatus}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-xs font-bold text-black">
                          <div>${u.balances.USD.toFixed(2)} USD</div>
                          <div className="text-neutral-500 font-normal">€{u.balances.EUR.toFixed(2)} EUR • £{u.balances.GBP.toFixed(2)} GBP</div>
                        </td>

                        <td className="p-4 text-right space-x-1.5">
                          {u.accountStatus === 'Suspended' ? (
                            <button
                              onClick={() => adminUpdateUserStatus(u.id, 'Verified')}
                              className="px-3 py-1.5 bg-[#16BD00] text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-all"
                            >
                              Reactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => adminUpdateUserStatus(u.id, 'Suspended')}
                              className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all"
                            >
                              Suspend
                            </button>
                          )}

                          <button
                            onClick={() => { setSelectedUserId(u.id); setNewBalance(u.balances.USD.toString()); }}
                            className="px-3 py-1.5 bg-black text-[#FFFF00] text-xs font-bold rounded-xl hover:bg-neutral-800 transition-all"
                          >
                            Edit Balance
                          </button>

                          <button
                            onClick={() => setGrantStockUserId(u.id)}
                            className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold rounded-xl transition-all"
                          >
                            Grant Stock
                          </button>

                          {u.role !== 'admin' && (
                            <button
                              onClick={() => adminDeleteUser(u.id)}
                              title="Delete Account"
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all inline-block"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Balance Editor Modal/Drawer */}
              {selectedUserId && (
                <div className="p-5 bg-[#F7F6F5] rounded-2xl border border-black/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-black" />
                    <span className="text-xs font-mono font-bold text-black uppercase">
                      Adjust Balance for ({allUsers.find(u => u.id === selectedUserId)?.name}):
                    </span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto items-center">
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value as any)}
                      className="px-3 py-2 bg-white border border-[#EBEBEB] rounded-xl text-xs font-mono font-bold text-black"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>

                    <input
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      className="px-4 py-2 bg-white border border-[#EBEBEB] rounded-xl text-xs font-mono font-bold text-black focus:outline-none focus:border-black"
                    />

                    <button
                      onClick={handleAdjustBalance}
                      className="px-4 py-2 bg-[#FFFF00] text-black font-bold text-xs rounded-xl hover:bg-[#E6E600] transition-all shadow-sm"
                    >
                      Save Balance
                    </button>
                    <button
                      onClick={() => setSelectedUserId(null)}
                      className="px-3 py-2 bg-neutral-200 text-black font-bold text-xs rounded-xl hover:bg-neutral-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Grant Stock Drawer */}
              {grantStockUserId && (
                <div className="p-5 bg-black text-white rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#FFFF00]" />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      Issue Stock Shares to ({allUsers.find(u => u.id === grantStockUserId)?.name}):
                    </span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto items-center">
                    <select
                      value={grantSymbol}
                      onChange={(e) => setGrantSymbol(e.target.value)}
                      className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs font-mono font-bold text-white"
                    >
                      <option value="NVDA">NVDA (NVIDIA)</option>
                      <option value="AAPL">AAPL (Apple)</option>
                      <option value="TSLA">TSLA (Tesla)</option>
                      <option value="BTC">BTC (Bitcoin)</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Shares"
                      value={grantShares}
                      onChange={(e) => setGrantShares(e.target.value)}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs font-mono font-bold text-white w-24"
                    />

                    <button
                      onClick={handleGrantStock}
                      className="px-4 py-2 bg-[#FFFF00] text-black font-bold text-xs rounded-xl hover:bg-[#E6E600] transition-all shadow-sm"
                    >
                      Allocate Shares
                    </button>
                    <button
                      onClick={() => setGrantStockUserId(null)}
                      className="px-3 py-2 bg-neutral-800 text-white font-bold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* VIEW 3: GLOBAL TRANSACTION LEDGER */}
          {activeTab === 'transactions' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-bold text-black font-geist">Global Transaction Audit Ledger</h2>
                  <p className="text-xs text-[#707070]">Inspect, approve, flag suspicious transfers, or issue full refunds</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#FFFF00] text-black px-3 py-1 rounded-full">
                  {globalTransactions.length} Total Transactions Recorded
                </span>
              </div>

              <div className="space-y-3">
                {globalTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 bg-[#F7F6F5] rounded-2xl border border-[#EBEBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        tx.status === 'Flagged'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : tx.status === 'Refunded'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-black text-[#FFFF00]'
                      }`}>
                        {tx.type === 'receive' ? '↓' : '↑'}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-black font-geist flex items-center gap-2">
                          <span>{tx.title}</span>
                          <span className="text-xs text-[#707070] font-normal font-mono">({tx.userName})</span>
                        </div>
                        <div className="text-xs text-[#707070] font-mono">{tx.subtitle} • {tx.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="font-bold text-sm font-mono text-black">${tx.amount.toFixed(2)} {tx.currency}</div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          tx.status === 'Completed'
                            ? 'bg-[#16BD00]/10 text-[#16BD00]'
                            : tx.status === 'Flagged'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          ● {tx.status}
                        </span>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-1.5">
                        {tx.status !== 'Completed' && (
                          <button
                            onClick={() => adminApproveTransaction(tx.id)}
                            className="px-2.5 py-1 bg-[#16BD00] text-white text-[11px] font-bold rounded-lg hover:bg-emerald-600"
                          >
                            Approve
                          </button>
                        )}
                        {tx.status !== 'Flagged' && (
                          <button
                            onClick={() => adminFlagTransaction(tx.id)}
                            className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg hover:bg-red-700"
                          >
                            Flag
                          </button>
                        )}
                        {tx.status !== 'Refunded' && (
                          <button
                            onClick={() => adminRefundTransaction(tx.id)}
                            className="px-2.5 py-1 bg-black text-[#FFFF00] text-[11px] font-bold rounded-lg hover:bg-neutral-800"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: SYSTEM SECURITY AUDIT STREAM */}
          {activeTab === 'audit' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-black font-geist">Platform Security & Administrative Audit Logs</h2>
                <span className="text-xs font-mono text-[#16BD00] font-bold">● Real-time Stream Active</span>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-[#F7F6F5] rounded-2xl border border-[#EBEBEB] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black text-[#FFFF00] font-bold text-xs flex items-center justify-center">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-black font-geist text-sm">{log.action}</div>
                        <div className="text-[#707070] text-[11px]">Admin: {log.adminName} → Target: {log.targetUserName} • {log.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-black text-sm">{log.amount}</div>
                      <span className="text-[#16BD00] font-bold">● {log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
