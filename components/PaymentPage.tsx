import React, { useState } from 'react';
import { CreditCardIcon } from './icons';
import type { Page } from '../App';

interface PaymentPageProps {
  onPaymentRequest: (plan: { credits: number, price: number }, transactionId: string) => void;
  setCurrentPage: (page: Page) => void;
}

const plans = [
  { credits: 40, price: 299, popular: false },
  { credits: 90, price: 599, popular: true },
  { credits: 150, price: 899, popular: false },
];

const PAYMENT_LINK = "https://razorpay.me/@hitenkumar";

const PaymentPage: React.FC<PaymentPageProps> = ({ onPaymentRequest, setCurrentPage }) => {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!transactionId.trim()) {
        setError('Please enter a valid Transaction ID.');
        return;
    }
    setError('');
    setIsSubmitting(true);
    onPaymentRequest(selectedPlan, transactionId);
    // Simulate a network request
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
    }, 1000);
  };
  
  if (submissionSuccess) {
    return (
        <div className="container mx-auto max-w-2xl text-center animate-fade-in">
            <div className="bg-white/50 dark:bg-gray-900/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold font-display mb-4 text-yellow-500">Request Submitted!</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">
                    Your request to add <span className="font-bold">{selectedPlan.credits} credits</span> is pending approval.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
                    An administrator will review your submission shortly. You will see the credits in your account once it's approved.
                </p>
                 <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setCurrentPage('user-payments')}
                        className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-800"
                    >
                        Check Status
                    </button>
                    <button
                        onClick={() => setCurrentPage('generator')}
                        className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
                        Back to Generator
                    </button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white">Purchase Credits</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Follow the steps below to add credits to your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Step 1: Select Plan */}
        <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 font-display text-center">1. Select a Plan</h2>
            <div className="space-y-4">
                {plans.map(plan => (
                    <div
                        key={plan.credits}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedPlan.credits === plan.credits ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">POPULAR</div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">{plan.credits} Credits</span>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{plan.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Step 2: Scan & Pay */}
        <div className="bg-white/50 dark:bg-gray-900/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 font-display text-center">2. Go & Pay</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Click the button below to pay <strong className="text-gray-800 dark:text-white">₹{selectedPlan.price}</strong> using our secure payment link. The link will open in a new tab.
            </p>
            <a
                href={PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                >
                <CreditCardIcon className="w-6 h-6" />
                <span>Pay ₹{selectedPlan.price} Now</span>
            </a>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                After paying, copy the Transaction ID and proceed to Step 3.
             </p>
        </div>

        {/* Step 3: Confirm Payment */}
        <div className="bg-white/50 dark:bg-gray-900/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 font-display text-center">3. Confirm Payment</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Enter the Transaction ID from your payment app to confirm your purchase.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction ID</label>
                    <input
                        id="transactionId"
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter your transaction ID here"
                        className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                </div>
                 {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
                    <CreditCardIcon className="w-5 h-5" />
                    <span>{isSubmitting ? 'Submitting...' : `Submit for Verification`}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;