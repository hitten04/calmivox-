import React from 'react';
import type { Generation } from '../App';
import { GalleryIcon, DownloadIcon } from './icons';

interface ImageHistoryProps {
    history: Generation[];
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history }) => {

    return (
        <div className="container mx-auto max-w-7xl animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white">Generation History</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">A gallery of your past creations.</p>
            </div>

            {history.length > 0 ? (
                <div className="space-y-12">
                    {history.map(item => (
                        <div key={item.id} className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.timestamp.toLocaleString()}</p>
                                <p className="text-gray-700 dark:text-gray-300 italic">"{item.prompt}"</p>
                            </div>
                            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
                                {item.images.map((src, index) => (
                                    <div key={index} className="group relative overflow-hidden rounded-2xl shadow-xl aspect-square">
                                        <img src={src} alt={`generated image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <a href={src} download={`calmivox-ai-image-history-${item.id}-${index + 1}.jpg`} className="flex items-center gap-2 px-4 py-2 bg-white/80 text-black rounded-lg hover:bg-white">
                                                <DownloadIcon className="w-5 h-5" />
                                                <span>Download</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-center text-gray-500 dark:text-gray-400 p-8">
                        <GalleryIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold font-display text-gray-700 dark:text-gray-300">No History Yet</h3>
                        <p className="mt-2">Your generated images will appear here after you create them.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageHistory;