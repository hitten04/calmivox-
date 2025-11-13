
import React, { useState } from 'react';
import { SunIcon, MoonIcon, LogoIcon } from './icons';

interface SignupPageProps {
    onSignup: (name: string, email: string, password: string) => { success: boolean; message: string };
    onNavigateToLogin: () => void;
    theme: string;
    toggleTheme: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin, theme, toggleTheme }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        const result = onSignup(name, email, password);
        if (result.success) {
            setSuccess(result.message);
            // Navigate to login after a short delay to show the success message
            setTimeout(() => {
                onNavigateToLogin();
            }, 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col items-center justify-center p-4">
             <div className="absolute top-4 right-4">
                 <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle theme"
                    >
                    {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                </button>
            </div>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                     <div className="flex items-center justify-center space-x-3 mb-4">
                        <LogoIcon className="w-12 h-16" />
                        <h1 className="text-4xl font-bold font-display text-gray-900 dark:text-white">Create Account</h1>
                     </div>
                     <p className="text-gray-600 dark:text-gray-400">Join Calmivox AI and get 10 free credits!</p>
                </div>

                <div className="bg-white/50 dark:bg-gray-900/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 dark:text-gray-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <input
                                id="email-signup"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 dark:text-gray-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-signup"className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                             <input
                                id="password-signup"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 dark:text-gray-200"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-500 text-center">{success}</p>}


                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                                disabled={!!success}
                            >
                                {success ? 'Redirecting...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <button onClick={onNavigateToLogin} className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;