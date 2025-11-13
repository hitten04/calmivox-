
import React, { useState } from 'react';
import { generateImages } from '../services/geminiService';
import { SparklesIcon, DownloadIcon, ImageIcon, UploadIcon } from './icons';
import Spinner from './Spinner';

interface ImageGeneratorProps {
  credits: number;
  deductCredits: (amount: number) => void;
  addGenerationToHistory: (prompt: string, images: string[]) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ credits, deductCredits, addGenerationToHistory }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const [gender, setGender] = useState<string>('Female');
  const [ageRange, setAgeRange] = useState<string>('19-24');
  const [country, setCountry] = useState<string>('India');
  const [backgroundTheme, setBackgroundTheme] = useState<string>('Studio');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).slice(0, 3);
      setUploadedFiles(files);
      setGeneratedImages([]);
      setError(null);
    }
  };
  
  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    const cost = numberOfImages;
    if (credits < cost) {
      setError(`You need ${cost} credit(s) to generate, but you only have ${credits}. Please purchase more.`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);
    try {
      const imageFiles = uploadedFiles.length > 0 ? uploadedFiles : undefined;
      const images = await generateImages(prompt, numberOfImages, imageFiles);
      setGeneratedImages(images);
      deductCredits(cost);
      addGenerationToHistory(prompt, images);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiSuggestPrompt = () => {
    const age = ageRange.split('-')[0];
    const backgroundPrompt = backgroundTheme === 'Studio'
        ? 'set against a professional studio background with soft, appealing lighting'
        : 'set against a realistic background that complements the product (e.g., city street, nature, modern interior)';

    const newPrompt = `A realistic, promotional photograph of a ${age}-year-old ${country} ${gender.toLowerCase()} model trying on the uploaded product. The model has a comfortable fitting and is striking a promotional pose. The shot is from the knees up or full-body, ${backgroundPrompt}.`;
    setPrompt(newPrompt);
  };

  const selectBaseClasses = "w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <div className="container mx-auto max-w-7xl animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Inputs */}
        <div className="space-y-8">
          {/* Upload Section */}
          <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-2 font-display">1. Upload Product Image (Optional)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">For a 'try-on' image, upload up to 3 product images. Describe the scene and model in the prompt below.</p>
            
            <div className="mb-2">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                  <UploadIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {uploadedFiles.length > 0 ? `${uploadedFiles.length} image(s) selected` : 'Select up to 3 Images'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, WEBP</span>
                  <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
              </label>
              {uploadedFiles.length > 0 && (
                  <div className="mt-4 flex justify-center items-center gap-4">
                      {uploadedFiles.map((file, index) => (
                        <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-lg inline-block shadow-md" />
                      ))}
                  </div>
              )}
            </div>
          </div>
          
          {/* Model Customization Section */}
          <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 font-display">Customize Model & Scene</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <div className="flex w-full bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                        <button onClick={() => setGender('Male')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${gender === 'Male' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Male</button>
                        <button onClick={() => setGender('Female')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${gender === 'Female' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Female</button>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Theme</label>
                    <div className="flex w-full bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                        <button onClick={() => setBackgroundTheme('Studio')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${backgroundTheme === 'Studio' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Studio</button>
                        <button onClick={() => setBackgroundTheme('Realistic')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${backgroundTheme === 'Realistic' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Realistic</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="age-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age Range</label>
                        <select id="age-range" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className={selectBaseClasses}>
                            <option>10-18</option>
                            <option>19-24</option>
                            <option>25-30</option>
                            <option>31-40</option>
                            <option>41-50</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                        <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} className={selectBaseClasses}>
                            <option>India</option>
                            <option>USA</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>


          {/* Prompt Section */}
          <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-display">2. Craft Your Prompt</h2>
              <button onClick={handleAiSuggestPrompt} title="AI Suggest Prompt" className="p-2 bg-blue-600/20 text-blue-500 rounded-full hover:bg-blue-600/30 transition-colors">
                <SparklesIcon className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the desired scene, model, and action. e.g., 'A professional photo of a male model trying on this shirt in a city street.'"
              className="w-full h-40 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 dark:text-gray-200"
            />
          </div>
          
          {/* Generation Control */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <label htmlFor="num-images" className="font-semibold text-gray-700 dark:text-gray-300">Number of images:</label>
                <select id="num-images" value={numberOfImages} onChange={(e) => setNumberOfImages(Number(e.target.value))} className={`${selectBaseClasses} flex-grow`}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt || credits < numberOfImages}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              {isGenerating ? <Spinner /> : <SparklesIcon className="w-6 h-6" />}
              <span>{isGenerating ? 'Generating...' : `Generate (${numberOfImages} Credit${numberOfImages > 1 ? 's' : ''})`}</span>
            </button>
          </div>
        </div>

        {/* Column 2: Outputs */}
        <div className="lg:sticky lg:top-24 h-full">
            <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 w-full min-h-[500px] lg:min-h-0 lg:h-full flex flex-col justify-center items-center transition-all duration-300">
                
                {isGenerating && (
                    <div className="text-center animate-fade-in">
                        <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Generating your masterpiece...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">This can take a few moments.</p>
                    </div>
                )}
                
                {!isGenerating && error && <div className="text-red-500 p-4 bg-red-500/10 rounded-lg text-center animate-fade-in">{error}</div>}

                {!isGenerating && !error && generatedImages.length > 0 && (
                    <div className="w-full h-full animate-slide-up">
                        <h2 className="text-2xl font-bold mb-4 text-center font-display">Your Creations</h2>
                        <div className={`grid ${generatedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                            {generatedImages.map((src, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-xl aspect-square">
                                    <img src={src} alt={`generated image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <a href={src} download={`calmivox-ai-image-${index + 1}.jpg`} className="flex items-center gap-2 px-4 py-2 bg-white/80 text-black rounded-lg hover:bg-white">
                                            <DownloadIcon className="w-5 h-5" />
                                            <span>Download</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isGenerating && !error && generatedImages.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 p-8 animate-fade-in">
                        <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold font-display text-gray-700 dark:text-gray-300">Image Output</h3>
                        <p className="mt-2">Your generated images will appear here.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;