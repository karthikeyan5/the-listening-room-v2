
import React, { useState, useRef, useEffect } from 'react';
import KeyIcon from './icons/KeyIcon';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, clientId: string) => void;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ isOpen, onClose, onSave }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('googleApiKey') || '');
      setClientId(localStorage.getItem('googleClientId') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSave = () => {
    if (apiKey.trim() && clientId.trim()) {
      onSave(apiKey.trim(), clientId.trim());
    } else {
      alert("Please provide both an API Key and a Client ID.");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-700"
      >
        <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-slate-700 rounded-full mb-4">
                <KeyIcon />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Google Drive Configuration</h2>
            <p className="text-gray-400 mb-6">
                Provide your Google API Key and Client ID to enable integration. 
                <br/>
                These are stored only in your browser.
            </p>
        </div>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-300 mb-1">Google API Key</label>
                <input
                  type="text"
                  id="api-key-input"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your API Key"
                />
            </div>
             <div>
                <label htmlFor="client-id-input" className="block text-sm font-medium text-gray-300 mb-1">Google Client ID</label>
                <input
                  type="text"
                  id="client-id-input"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your Client ID"
                />
            </div>
             <p className="text-xs text-gray-500 text-center pt-2">
                You can get these from the 
                <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline px-1"
                >
                    Google Cloud Console
                </a>
                for your project.
            </p>
        </div>

        <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 rounded-md hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition"
            >
              Save and Initialize
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationModal;
