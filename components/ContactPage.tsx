import React, { useState } from 'react';
import { MailIcon, PhoneIcon, SparklesIcon } from './icons';
import Spinner from './Spinner';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            setError('Please fill out all fields.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        setSubmissionSuccess(false);

        try {
            const response = await fetch('https://formspree.io/f/mdoqrony', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, subject, message }),
            });

            if (response.ok) {
                setSubmissionSuccess(true);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
                setTimeout(() => setSubmissionSuccess(false), 5000);
            } else {
                const data = await response.json();
                if (data.errors) {
                    setError(data.errors.map((error: { message: string }) => error.message).join(', '));
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError('An error occurred while sending your message.');
                }
            }
        } catch (error) {
            setError('A network error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 dark:text-gray-200";

    return (
        <div className="container mx-auto max-w-5xl animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white">Get In Touch</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">We'd love to hear from you. Please fill out the form below or contact us directly.</p>
            </div>

            <div className="bg-white/50 dark:bg-gray-900/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Side: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold font-display mb-4">Contact Information</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                For any inquiries, support requests, or feedback, feel free to reach out to us.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <a href="mailto:hp040912@gmail.com" className="flex items-center space-x-4 group">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                    <MailIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Email</p>
                                    <p className="text-gray-600 dark:text-gray-400">hp040912@gmail.com</p>
                                </div>
                            </a>
                             <a href="tel:+919558883186" className="flex items-center space-x-4 group">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                    <PhoneIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Phone</p>
                                    <p className="text-gray-600 dark:text-gray-400">+91 95588 83186</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div>
                         <h2 className="text-2xl font-bold font-display mb-4">Send us a Message</h2>
                         <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="sr-only">Name</label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className={inputClasses} />
                                </div>
                                 <div>
                                    <label htmlFor="email-contact" className="sr-only">Email</label>
                                    <input type="email" id="email-contact" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Email" className={inputClasses} />
                                </div>
                             </div>
                             <div>
                                <label htmlFor="subject" className="sr-only">Subject</label>
                                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className={inputClasses} />
                            </div>
                             <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Your Message" className={inputClasses}></textarea>
                            </div>

                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                            
                            {submissionSuccess && <p className="text-sm text-green-500 text-center p-3 bg-green-500/10 rounded-lg">Thank you! Your message has been sent successfully.</p>}

                             <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                                >
                                    {isSubmitting ? <Spinner /> : <SparklesIcon className="w-6 h-6" />}
                                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                </button>
                            </div>
                         </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;