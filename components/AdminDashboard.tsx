import React, { useState } from 'react';
import type { User, PaymentRequest } from '../App';
import { AdminDashboardIcon, UsersIcon, CreditCardIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface AdminDashboardProps {
    users: User[];
    payments: PaymentRequest[];
    manageUserCredits: (userId: number, amount: number, type: 'add' | 'deduct') => void;
    handlePaymentDecision: (paymentId: number, decision: 'approved' | 'rejected') => void;
}

type AdminPage = 'overview' | 'users' | 'payments';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, payments, manageUserCredits, handlePaymentDecision }) => {
    const [currentPage, setCurrentPage] = useState<AdminPage>('overview');
    const [modal, setModal] = useState<'credits' | 'confirmPayment' | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
    const [paymentDecision, setPaymentDecision] = useState<'approved' | 'rejected' | null>(null);
    const [creditAmount, setCreditAmount] = useState<number>(0);
    const [creditAction, setCreditAction] = useState<'add' | 'deduct'>('add');

    // Stats for overview
    const totalUsers = users.length;
    const pendingRequests = payments.filter(p => p.status === 'pending').length;
    const totalCreditsDistributed = users.reduce((acc, user) => acc + user.credits, 0);

    const openCreditModal = (user: User) => {
        setSelectedUser(user);
        setCreditAmount(0);
        setModal('credits');
    };
    
    const openPaymentConfirmModal = (payment: PaymentRequest, decision: 'approved' | 'rejected') => {
        setSelectedPayment(payment);
        setPaymentDecision(decision);
        setModal('confirmPayment');
    };

    const closeModals = () => {
        setModal(null);
        setSelectedUser(null);
        setSelectedPayment(null);
        setPaymentDecision(null);
    };

    const handleCreditSubmit = () => {
        if (!selectedUser || creditAmount <= 0) return;
        manageUserCredits(selectedUser.id, creditAmount, creditAction);
        closeModals();
    };
    
    const handleConfirmPayment = () => {
        if (!selectedPayment || !paymentDecision) return;
        handlePaymentDecision(selectedPayment.id, paymentDecision);
        closeModals();
    };
    
    const StatusBadge: React.FC<{ status: 'pending' | 'approved' | 'rejected' }> = ({ status }) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        if (status === 'approved') return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>Approved</span>;
        if (status === 'rejected') return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>Rejected</span>;
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>Pending</span>;
    };


    const renderContent = () => {
        switch (currentPage) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
                            <UsersIcon className="w-10 h-10 text-blue-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold">{totalUsers}</p>
                            </div>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
                            <CreditCardIcon className="w-10 h-10 text-yellow-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Requests</p>
                                <p className="text-2xl font-bold">{pendingRequests}</p>
                            </div>
                        </div>
                         <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
                            <CreditCardIcon className="w-10 h-10 text-green-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Credits</p>
                                <p className="text-2xl font-bold">{totalCreditsDistributed}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg animate-fade-in overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="p-4">User</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Credits</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                                        <td className="p-4 font-medium">{user.name}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                        <td className="p-4 font-bold text-blue-600">{user.credits}</td>
                                        <td className="p-4">
                                            <button onClick={() => openCreditModal(user)} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">Manage</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'payments':
                return (
                     <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg animate-fade-in overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="p-4">User</th>
                                    <th className="p-4">Plan</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                                        <td className="p-4 font-medium">{p.userName}</td>
                                        <td className="p-4">{p.plan}</td>
                                        <td className="p-4 font-semibold">₹{p.amount}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{p.transactionId}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{p.date.toLocaleDateString()}</td>
                                        <td className="p-4"><StatusBadge status={p.status} /></td>
                                        <td className="p-4">
                                            {p.status === 'pending' ? (
                                                <div className="flex space-x-2">
                                                    <button onClick={() => openPaymentConfirmModal(p, 'approved')} className="p-1 text-green-600 hover:text-green-800"><CheckCircleIcon className="w-6 h-6"/></button>
                                                    <button onClick={() => openPaymentConfirmModal(p, 'rejected')} className="p-1 text-red-600 hover:text-red-800"><XCircleIcon className="w-6 h-6"/></button>
                                                </div>
                                            ) : (
                                               <span>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
        }
    };
    
    const TabButton: React.FC<{ page: AdminPage; label: string; icon: React.ReactNode }> = ({ page, label, icon }) => (
        <button
            onClick={() => setCurrentPage(page)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            currentPage === page
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="container mx-auto max-w-7xl animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Manage users, payments, and application data.</p>
            </div>

            <div className="flex justify-center mb-8 bg-gray-100/50 dark:bg-gray-800/50 p-2 rounded-xl">
                <TabButton page="overview" label="Overview" icon={<AdminDashboardIcon className="w-5 h-5"/>} />
                <TabButton page="users" label="Users" icon={<UsersIcon className="w-5 h-5"/>} />
                <TabButton page="payments" label="Payments" icon={<CreditCardIcon className="w-5 h-5"/>} />
            </div>

            {renderContent()}
            
            {/* Credit Management Modal */}
            {modal === 'credits' && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in" onClick={closeModals}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                         <h2 className="text-xl font-bold mb-2">Manage Credits for {selectedUser.name}</h2>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Current balance: <span className="font-bold text-blue-500">{selectedUser.credits}</span></p>

                         <div className="flex w-full bg-gray-200 dark:bg-gray-700 rounded-lg p-1 mb-4">
                             <button onClick={() => setCreditAction('add')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${creditAction === 'add' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Add</button>
                             <button onClick={() => setCreditAction('deduct')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${creditAction === 'deduct' ? 'bg-red-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Deduct</button>
                         </div>
                         
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                            <input
                                type="number"
                                value={creditAmount}
                                onChange={e => setCreditAmount(Number(e.target.value))}
                                className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                min="0"
                            />
                         </div>

                         <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={closeModals} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                            <button onClick={handleCreditSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirm</button>
                         </div>
                    </div>
                </div>
            )}

            {/* Payment Confirmation Modal */}
            {modal === 'confirmPayment' && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in" onClick={closeModals}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                         <h2 className="text-xl font-bold mb-2">Confirm Action</h2>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Are you sure you want to <span className={paymentDecision === 'approved' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{paymentDecision}</span> this payment request?
                         </p>
                         <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-sm">
                            <p><strong>User:</strong> {selectedPayment.userName}</p>
                            <p><strong>Plan:</strong> {selectedPayment.plan}</p>
                            <p><strong>Transaction ID:</strong> {selectedPayment.transactionId}</p>
                         </div>
                         <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={closeModals} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                            <button onClick={handleConfirmPayment} className={`px-4 py-2 text-white rounded-lg ${paymentDecision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                Confirm {paymentDecision === 'approved' ? 'Approval' : 'Rejection'}
                            </button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;