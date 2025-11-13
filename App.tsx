import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import PaymentPage from './components/PaymentPage';
import AdminDashboard from './components/AdminDashboard';
import UserPayments from './components/UserPayments';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ImageHistory from './components/ImageHistory';

export type Page = 'generator' | 'history' | 'payment' | 'admin' | 'user-payments';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  credits: number;
  role: 'admin' | 'user';
}

export interface PaymentRequest {
  id: number;
  userId: number;
  userName: string;
  plan: string;
  amount: number;
  credits: number;
  transactionId: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Generation {
    id: number;
    userId: number;
    prompt: string;
    images: string[];
    timestamp: Date;
}


const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin', email: 'hp040912@gmail.com', password: 'admin', credits: 999999, role: 'admin' },
  { id: 2, name: 'User', email: 'user@example.com', password: 'user', credits: 25, role: 'user' },
  { id: 3, name: 'Active Client', email: 'client@example.com', password: 'password', credits: 50, role: 'user' },
];

const MOCK_PAYMENT_REQUESTS: PaymentRequest[] = [
  { 
    id: 1, 
    userId: 3, 
    userName: 'Active Client', 
    plan: '40 Credits', 
    amount: 299, 
    credits: 40, 
    transactionId: 'mock-txn-client-approved', 
    date: new Date(new Date().setDate(new Date().getDate() - 1)), // 1 day ago
    status: 'approved' 
  },
];

const MOCK_GENERATION_HISTORY: Generation[] = [];


const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [currentPage, setCurrentPage] = useState<Page>('generator');
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(MOCK_PAYMENT_REQUESTS);
  const [generationHistory, setGenerationHistory] = useState<Generation[]>(MOCK_GENERATION_HISTORY);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const handleLogin = (email: string, password: string):boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        setCurrentUser(user);
        return true;
    }
    return false;
  };

  const handleSignup = (name: string, email: string, password: string): { success: boolean; message: string } => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
        id: users.length + 1,
        name,
        email,
        password,
        credits: 10, // New users get 10 credits
        role: 'user',
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, message: 'Signup successful! Please log in.' };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('generator');
  };

  const handlePaymentRequest = (plan: { credits: number, price: number }, transactionId: string) => {
    if (!currentUser) return;

    const newPayment: PaymentRequest = {
        id: paymentRequests.length + 1,
        userId: currentUser.id,
        userName: currentUser.name,
        plan: `${plan.credits} Credits`,
        amount: plan.price,
        credits: plan.credits,
        transactionId: transactionId,
        date: new Date(),
        status: 'pending',
    };
    setPaymentRequests(prev => [newPayment, ...prev]);
  };

  const handlePaymentDecision = (paymentId: number, decision: 'approved' | 'rejected') => {
    const payment = paymentRequests.find(p => p.id === paymentId);
    if (!payment) return;

    if (decision === 'approved') {
        manageUserCredits(payment.userId, payment.credits, 'add');
    }

    setPaymentRequests(prev => prev.map(p =>
        p.id === paymentId ? { ...p, status: decision } : p
    ));
  };


  const manageUserCredits = (userId: number, amount: number, type: 'add' | 'deduct') => {
    let updatedUser: User | undefined;
    setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === userId) {
            const newCredits = type === 'add' ? user.credits + amount : Math.max(0, user.credits - amount);
            updatedUser = { ...user, credits: newCredits };
            return updatedUser;
        }
        return user;
    }));
    
    if (currentUser && currentUser.id === userId && updatedUser) {
        setCurrentUser(updatedUser);
    }
  };
  
  const deductCredits = (amount: number) => {
    if (!currentUser) return;
    manageUserCredits(currentUser.id, amount, 'deduct');
  };

  const addGenerationToHistory = (prompt: string, images: string[]) => {
      if (!currentUser) return;
      const newGeneration: Generation = {
          id: generationHistory.length + 1,
          userId: currentUser.id,
          prompt,
          images,
          timestamp: new Date(),
      };
      setGenerationHistory(prev => [newGeneration, ...prev]);
  };
  
  if (!currentUser) {
    if (authPage === 'login') {
        return <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} onNavigateToSignup={() => setAuthPage('signup')} />;
    } else {
        return <SignupPage onSignup={handleSignup} onNavigateToLogin={() => setAuthPage('login')} theme={theme} toggleTheme={toggleTheme} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'generator':
        return <ImageGenerator credits={currentUser.credits} deductCredits={deductCredits} addGenerationToHistory={addGenerationToHistory} />;
      case 'history':
        return <ImageHistory history={generationHistory.filter(g => g.userId === currentUser.id)} />;
      case 'payment':
        return <PaymentPage onPaymentRequest={handlePaymentRequest} setCurrentPage={setCurrentPage} />;
      case 'admin':
        // Double-check role for security, though the button is already hidden.
        return currentUser.role === 'admin' ? <AdminDashboard users={users} payments={paymentRequests} manageUserCredits={manageUserCredits} handlePaymentDecision={handlePaymentDecision} /> : <h2>Access Denied</h2>;
      case 'user-payments':
        return <UserPayments payments={paymentRequests.filter(p => p.userId === currentUser.id)} />;
      default:
        return <ImageGenerator credits={currentUser.credits} deductCredits={deductCredits} addGenerationToHistory={addGenerationToHistory} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-gray-800 dark:text-gray-200 font-sans">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        logout={handleLogout}
      />
      <main className="px-4 py-8 md:px-8 md:py-12">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;