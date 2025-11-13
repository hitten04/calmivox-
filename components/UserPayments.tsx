import React from 'react';
import type { PaymentRequest } from '../App';
import { HistoryIcon } from './icons';

interface UserPaymentsProps {
    payments: PaymentRequest[];
}

const UserPayments: React.FC<UserPaymentsProps> = ({ payments }) => {

    const StatusBadge: React.FC<{ status: 'pending' | 'approved' | 'rejected' }> = ({ status }) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        if (status === 'approved') return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>Approved</span>;
        if (status === 'rejected') return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>Rejected</span>;
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>Pending</span>;
    };

    return (
        <div className="container mx-auto max-w-4xl animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white">My Payments</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Here is a history of your credit purchase requests.</p>
            </div>

            <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
                {payments.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-4">Date</th>
                                <th className="p-4">Plan</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Transaction ID</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                                    <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{p.date.toLocaleString()}</td>
                                    <td className="p-4 font-medium">{p.plan}</td>
                                    <td className="p-4 font-semibold">₹{p.amount}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{p.transactionId}</td>
                                    <td className="p-4"><StatusBadge status={p.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 p-8">
                        <HistoryIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold font-display text-gray-700 dark:text-gray-300">No Payment History</h3>
                        <p className="mt-2">You haven't made any purchase requests yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPayments;