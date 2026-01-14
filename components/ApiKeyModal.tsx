
import React, { useState } from 'react';

export const ApiKeyModal: React.FC = () => {
  const [key, setKey] = useState('');
  const [isVisible, setIsVisible] = useState(!process.env.API_KEY && !localStorage.getItem('GEMINI_API_KEY'));

  const handleSave = () => {
    if (key.trim().length > 10) {
      localStorage.setItem('GEMINI_API_KEY', key.trim());
      setIsVisible(false);
      window.location.reload();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 md:p-16 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-8">
          <i className="fas fa-key text-3xl"></i>
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">AI Activation Required</h2>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium">
          To enable my **Digital Twin**, please enter a free Gemini API key. This key is stored locally in your browser and is never sent to my servers.
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Gemini API Key</label>
            <input 
              type="password" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 focus:border-indigo-600 outline-none font-bold transition-all" 
              placeholder="Paste your key here..." 
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start">
            <i className="fas fa-info-circle text-blue-600 mt-1"></i>
            <p className="text-sm text-blue-800 font-medium">
              Don't have one? You can get a free key in seconds at <a href="https://aistudio.google.com/app/apikey" target="_blank" className="font-black underline">Google AI Studio</a>.
            </p>
          </div>

          <button 
            onClick={handleSave}
            disabled={key.length < 10}
            className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            Activate Digital Twin
          </button>
        </div>
      </div>
    </div>
  );
};
