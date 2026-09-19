import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  isSupabaseConfigured,
  supabaseSignIn,
  supabaseSignUp,
  supabaseUpdateWallet,
  supabaseAddTransaction,
} from '../lib/supabase';

export interface StockHolding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  userId?: string;
  userName?: string;
  type: 'send' | 'receive' | 'transfer' | 'buy_stock' | 'sell_stock';
  title: string;
  subtitle: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  date: string;
  status: 'Completed' | 'In-Process' | 'Flagged' | 'Refunded';
}

export interface AuditLogItem {
  id: string;
  adminName: string;
  targetUserName: string;
  action: string;
  amount?: string;
  timestamp: string;
  status: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  accountStatus: 'Active' | 'Suspended' | 'Verified' | 'Pending';
  accountNumber: string;
  iban: string;
  balances: {
    USD: number;
    EUR: number;
    GBP: number;
  };
  stocks: StockHolding[];
  transactions: Transaction[];
  token?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  allUsers: UserProfile[];
  auditLogs: AuditLogItem[];
  isPlatformFrozen: boolean;
  isBackendConnected: boolean;
  login: (role?: 'user' | 'admin') => void;
  loginWithSupabase: (email: string, pass: string) => Promise<void>;
  signupWithSupabase: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  sendMoney: (recipient: string, amount: number, currency?: 'USD' | 'EUR' | 'GBP') => boolean;
  receiveMoney: (sender: string, amount: number) => void;
  transferFunds: (from: 'USD' | 'EUR' | 'GBP', to: 'USD' | 'EUR' | 'GBP', amount: number) => boolean;
  buyStock: (symbol: string, name: string, shares: number, price: number) => boolean;
  sellStock: (symbol: string, shares: number, price: number) => boolean;
  
  // Advanced Admin Control API
  adminApproveTransaction: (txId: string) => void;
  adminFlagTransaction: (txId: string) => void;
  adminRefundTransaction: (txId: string) => void;
  adminUpdateUserStatus: (userId: string, status: 'Active' | 'Suspended' | 'Verified') => void;
  adminAdjustBalance: (userId: string, currency: 'USD' | 'EUR' | 'GBP', newBalance: number) => void;
  adminDeleteUser: (userId: string) => void;
  adminGrantStockAllocation: (userId: string, symbol: string, name: string, shares: number, price: number) => void;
  adminTogglePlatformFreeze: () => void;
}

const initialDemoCustomer: UserProfile = {
  id: 'usr_101',
  name: 'Mila Wilson',
  email: 'mila.wilson@finara.com',
  role: 'user',
  accountStatus: 'Verified',
  accountNumber: '****9468',
  iban: 'US89 FINR 0001 2345 6789 9468',
  balances: {
    USD: 29450.00,
    EUR: 4120.50,
    GBP: 1850.00,
  },
  stocks: [
    { symbol: 'NVDA', name: 'NVIDIA Corp', shares: 15, avgPrice: 110.50, currentPrice: 128.40 },
    { symbol: 'AAPL', name: 'Apple Inc', shares: 25, avgPrice: 195.00, currentPrice: 224.30 },
    { symbol: 'TSLA', name: 'Tesla Inc', shares: 10, avgPrice: 210.00, currentPrice: 235.80 },
    { symbol: 'BTC', name: 'Bitcoin', shares: 0.15, avgPrice: 58000.00, currentPrice: 62450.00 },
  ],
  transactions: [
    {
      id: 'tx_801',
      userId: 'usr_101',
      userName: 'Mila Wilson',
      type: 'receive',
      title: 'Dave',
      subtitle: 'Global Settlement',
      amount: 24553.00,
      currency: 'USD',
      date: 'Today',
      status: 'Completed',
    },
    {
      id: 'tx_802',
      userId: 'usr_101',
      userName: 'Mila Wilson',
      type: 'buy_stock',
      title: 'NVIDIA Corp (NVDA)',
      subtitle: 'Bought 15 Shares',
      amount: 1657.50,
      currency: 'USD',
      date: 'Yesterday',
      status: 'Completed',
    },
  ],
};

const initialDemoAdmin: UserProfile = {
  id: 'usr_admin_01',
  name: 'Finara Super Admin',
  email: 'admin@finara.com',
  role: 'admin',
  accountStatus: 'Verified',
  accountNumber: '****0001',
  iban: 'US89 FINR 0000 0000 0000 0001',
  balances: { USD: 1000000.00, EUR: 500000.00, GBP: 250000.00 },
  stocks: [],
  transactions: [],
};

const initialLogs: AuditLogItem[] = [
  { id: 'log_01', adminName: 'Finara Super Admin', targetUserName: 'Mila Wilson', action: 'Outbound Transfer Verification', amount: '$24,553.00', timestamp: '10 mins ago', status: 'Approved' },
  { id: 'log_02', adminName: 'Finara Super Admin', targetUserName: 'Mila Wilson', action: 'USD Treasury Rebalance', amount: '+$5,000.00', timestamp: '30 mins ago', status: 'Completed' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBackendConnected = isSupabaseConfigured();

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('finara_user_session');
    return saved ? JSON.parse(saved) : initialDemoCustomer;
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('finara_all_users');
    return saved ? JSON.parse(saved) : [initialDemoCustomer, initialDemoAdmin];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('finara_audit_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [isPlatformFrozen, setIsPlatformFrozen] = useState<boolean>(() => {
    return localStorage.getItem('finara_platform_freeze') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('finara_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('finara_user_session');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('finara_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('finara_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('finara_platform_freeze', isPlatformFrozen.toString());
  }, [isPlatformFrozen]);

  const logAdminAction = (targetName: string, action: string, amount?: string) => {
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      adminName: user?.name || 'Admin Console',
      targetUserName: targetName,
      action,
      amount: amount || '-',
      timestamp: 'Just now',
      status: 'Completed',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = (role: 'user' | 'admin' = 'user') => {
    const target = role === 'admin' ? initialDemoAdmin : initialDemoCustomer;
    setUser(target);
  };

  const loginWithSupabase = async (email: string, pass: string) => {
    const supaUser = await supabaseSignIn(email, pass);
    const fullUser: UserProfile = {
      id: supaUser.id,
      name: supaUser.name,
      email: supaUser.email,
      role: supaUser.role,
      accountStatus: supaUser.accountStatus,
      accountNumber: `****${supaUser.id.slice(0, 4)}`,
      iban: supaUser.iban,
      balances: { USD: 7000.75, EUR: 5320.00, GBP: 3150.00 },
      stocks: [
        { symbol: 'NVDA', name: 'NVIDIA Corp', shares: 10, avgPrice: 115.00, currentPrice: 128.40 },
      ],
      transactions: [],
      token: supaUser.token,
    };
    setUser(fullUser);
    setAllUsers(prev => [fullUser, ...prev.filter(u => u.id !== fullUser.id)]);
  };

  const signupWithSupabase = async (email: string, pass: string, name: string) => {
    const supaUser = await supabaseSignUp(email, pass, name);
    const fullUser: UserProfile = {
      id: supaUser.id,
      name: supaUser.name,
      email: supaUser.email,
      role: 'user',
      accountStatus: 'Verified',
      accountNumber: `****${supaUser.id.slice(0, 4)}`,
      iban: supaUser.iban,
      balances: { USD: 7000.75, EUR: 5320.00, GBP: 3150.00 },
      stocks: [],
      transactions: [],
      token: supaUser.token,
    };
    setUser(fullUser);
    setAllUsers(prev => [fullUser, ...prev.filter(u => u.id !== fullUser.id)]);
  };

  const logout = () => {
    setUser(null);
  };

  // User Financial Transactions
  const sendMoney = (recipient: string, amount: number, currency: 'USD' | 'EUR' | 'GBP' = 'USD'): boolean => {
    if (isPlatformFrozen || !user || user.accountStatus === 'Suspended' || user.balances[currency] < amount) return false;

    const newBalances = { ...user.balances, [currency]: user.balances[currency] - amount };
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type: 'send',
      title: recipient,
      subtitle: 'Outbound Transfer',
      amount: amount,
      currency: currency,
      date: 'Today',
      status: 'Completed',
    };

    const updatedUser = {
      ...user,
      balances: newBalances,
      transactions: [newTx, ...user.transactions],
    };

    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    if (isBackendConnected) {
      supabaseUpdateWallet(user.id, newBalances, user.token);
      supabaseAddTransaction({
        userId: user.id,
        type: 'send',
        title: recipient,
        subtitle: 'Outbound Transfer',
        amount,
        currency,
        recipientEmail: recipient,
      }, user.token);
    }

    return true;
  };

  const receiveMoney = (sender: string, amount: number) => {
    if (isPlatformFrozen || !user) return;
    const newBalances = { ...user.balances, USD: user.balances.USD + amount };
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type: 'receive',
      title: sender,
      subtitle: 'Inbound Deposit',
      amount: amount,
      currency: 'USD',
      date: 'Today',
      status: 'Completed',
    };

    const updatedUser = {
      ...user,
      balances: newBalances,
      transactions: [newTx, ...user.transactions],
    };

    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    if (isBackendConnected) {
      supabaseUpdateWallet(user.id, newBalances, user.token);
      supabaseAddTransaction({
        userId: user.id,
        type: 'receive',
        title: sender,
        subtitle: 'Inbound Deposit',
        amount,
        currency: 'USD',
      }, user.token);
    }
  };

  const transferFunds = (from: 'USD' | 'EUR' | 'GBP', to: 'USD' | 'EUR' | 'GBP', amount: number): boolean => {
    if (isPlatformFrozen || !user || user.accountStatus === 'Suspended' || user.balances[from] < amount) return false;

    const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79 };
    const usdEquivalent = amount / rates[from];
    const targetAmount = usdEquivalent * rates[to];

    const newBalances = {
      ...user.balances,
      [from]: user.balances[from] - amount,
      [to]: user.balances[to] + targetAmount,
    };

    const updatedUser = {
      ...user,
      balances: newBalances,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          userId: user.id,
          userName: user.name,
          type: 'transfer' as const,
          title: `Transfer ${from} → ${to}`,
          subtitle: `Converted ${amount} ${from}`,
          amount: amount,
          currency: from,
          date: 'Today',
          status: 'Completed' as const,
        },
        ...user.transactions,
      ],
    };

    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    if (isBackendConnected) {
      supabaseUpdateWallet(user.id, newBalances, user.token);
    }

    return true;
  };

  const buyStock = (symbol: string, name: string, shares: number, price: number): boolean => {
    const totalCost = shares * price;
    if (isPlatformFrozen || !user || user.accountStatus === 'Suspended' || user.balances.USD < totalCost) return false;

    const existingStock = user.stocks.find(s => s.symbol === symbol);
    let updatedStocks: StockHolding[];

    if (existingStock) {
      const totalShares = existingStock.shares + shares;
      const avgPrice = ((existingStock.shares * existingStock.avgPrice) + totalCost) / totalShares;
      updatedStocks = user.stocks.map(s => s.symbol === symbol ? { ...s, shares: totalShares, avgPrice, currentPrice: price } : s);
    } else {
      updatedStocks = [...user.stocks, { symbol, name, shares, avgPrice: price, currentPrice: price }];
    }

    const newBalances = { ...user.balances, USD: user.balances.USD - totalCost };

    const updatedUser = {
      ...user,
      balances: newBalances,
      stocks: updatedStocks,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          userId: user.id,
          userName: user.name,
          type: 'buy_stock' as const,
          title: `${name} (${symbol})`,
          subtitle: `Bought ${shares} shares @ $${price.toFixed(2)}`,
          amount: totalCost,
          currency: 'USD' as const,
          date: 'Today',
          status: 'Completed' as const,
        },
        ...user.transactions,
      ],
    };

    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    if (isBackendConnected) {
      supabaseUpdateWallet(user.id, newBalances, user.token);
    }

    return true;
  };

  const sellStock = (symbol: string, shares: number, price: number): boolean => {
    if (isPlatformFrozen || !user || user.accountStatus === 'Suspended') return false;
    const existingStock = user.stocks.find(s => s.symbol === symbol);
    if (!existingStock || existingStock.shares < shares) return false;

    const totalReturn = shares * price;
    let updatedStocks: StockHolding[];

    if (existingStock.shares === shares) {
      updatedStocks = user.stocks.filter(s => s.symbol !== symbol);
    } else {
      updatedStocks = user.stocks.map(s => s.symbol === symbol ? { ...s, shares: s.shares - shares } : s);
    }

    const newBalances = { ...user.balances, USD: user.balances.USD + totalReturn };

    const updatedUser = {
      ...user,
      balances: newBalances,
      stocks: updatedStocks,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          userId: user.id,
          userName: user.name,
          type: 'sell_stock' as const,
          title: `${existingStock.name} (${symbol})`,
          subtitle: `Sold ${shares} shares @ $${price.toFixed(2)}`,
          amount: totalReturn,
          currency: 'USD' as const,
          date: 'Today',
          status: 'Completed' as const,
        },
        ...user.transactions,
      ],
    };

    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    if (isBackendConnected) {
      supabaseUpdateWallet(user.id, newBalances, user.token);
    }

    return true;
  };

  // ADVANCED ADMIN CONTROL IMPLEMENTATIONS
  const adminApproveTransaction = (txId: string) => {
    let targetName = 'User';
    setAllUsers(prev => prev.map(u => {
      const hasTx = u.transactions.some(t => t.id === txId);
      if (hasTx) targetName = u.name;
      return {
        ...u,
        transactions: u.transactions.map(t => t.id === txId ? { ...t, status: 'Completed' as const } : t)
      };
    }));
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        transactions: prev.transactions.map(t => t.id === txId ? { ...t, status: 'Completed' as const } : t)
      } : null);
    }
    logAdminAction(targetName, `Approved Transaction #${txId}`);
  };

  const adminFlagTransaction = (txId: string) => {
    let targetName = 'User';
    setAllUsers(prev => prev.map(u => {
      const hasTx = u.transactions.some(t => t.id === txId);
      if (hasTx) targetName = u.name;
      return {
        ...u,
        transactions: u.transactions.map(t => t.id === txId ? { ...t, status: 'Flagged' as const } : t)
      };
    }));
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        transactions: prev.transactions.map(t => t.id === txId ? { ...t, status: 'Flagged' as const } : t)
      } : null);
    }
    logAdminAction(targetName, `Flagged Suspicious Transaction #${txId}`);
  };

  const adminRefundTransaction = (txId: string) => {
    let targetName = 'User';
    setAllUsers(prev => prev.map(u => {
      const tx = u.transactions.find(t => t.id === txId);
      if (tx) {
        targetName = u.name;
        const refundedBalances = {
          ...u.balances,
          [tx.currency]: u.balances[tx.currency] + tx.amount
        };
        const updatedTxList = u.transactions.map(t => t.id === txId ? { ...t, status: 'Refunded' as const } : t);
        return { ...u, balances: refundedBalances, transactions: updatedTxList };
      }
      return u;
    }));
    logAdminAction(targetName, `Refunded Transaction #${txId}`);
  };

  const adminUpdateUserStatus = (userId: string, status: 'Active' | 'Suspended' | 'Verified') => {
    const target = allUsers.find(u => u.id === userId);
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: status } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, accountStatus: status } : null);
    }
    logAdminAction(target?.name || 'User', `Set Account Status to ${status}`);
  };

  const adminAdjustBalance = (userId: string, currency: 'USD' | 'EUR' | 'GBP', newBalance: number) => {
    const target = allUsers.find(u => u.id === userId);
    setAllUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      balances: { ...u.balances, [currency]: newBalance }
    } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? {
        ...prev,
        balances: { ...prev.balances, [currency]: newBalance }
      } : null);
    }

    if (isBackendConnected && target) {
      const updatedBalances = { ...target.balances, [currency]: newBalance };
      supabaseUpdateWallet(userId, updatedBalances, user?.token);
    }

    logAdminAction(target?.name || 'User', `Adjusted ${currency} Balance to $${newBalance.toFixed(2)}`);
  };

  const adminDeleteUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    if (user && user.id === userId) {
      setUser(null);
    }
    logAdminAction(target?.name || 'User', 'Permanently Deleted User Account');
  };

  const adminGrantStockAllocation = (userId: string, symbol: string, name: string, shares: number, price: number) => {
    const target = allUsers.find(u => u.id === userId);
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const existing = u.stocks.find(s => s.symbol === symbol);
        let newStocks: StockHolding[];
        if (existing) {
          newStocks = u.stocks.map(s => s.symbol === symbol ? { ...s, shares: s.shares + shares } : s);
        } else {
          newStocks = [...u.stocks, { symbol, name, shares, avgPrice: price, currentPrice: price }];
        }
        return { ...u, stocks: newStocks };
      }
      return u;
    }));
    logAdminAction(target?.name || 'User', `Granted ${shares} Shares of ${symbol}`);
  };

  const adminTogglePlatformFreeze = () => {
    setIsPlatformFrozen(prev => {
      const nextState = !prev;
      logAdminAction('Platform Global', nextState ? 'ACTIVATED EMERGENCY FREEZE' : 'Lifted Emergency Freeze');
      return nextState;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      allUsers,
      auditLogs,
      isPlatformFrozen,
      isBackendConnected,
      login,
      loginWithSupabase,
      signupWithSupabase,
      logout,
      sendMoney,
      receiveMoney,
      transferFunds,
      buyStock,
      sellStock,
      adminApproveTransaction,
      adminFlagTransaction,
      adminRefundTransaction,
      adminUpdateUserStatus,
      adminAdjustBalance,
      adminDeleteUser,
      adminGrantStockAllocation,
      adminTogglePlatformFreeze,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
