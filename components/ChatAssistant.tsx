
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import SendIcon from './icons/SendIcon';
import ChatIcon from './icons/ChatIcon';
import CloseIcon from './icons/CloseIcon';

interface ChatAssistantProps {
  onNewFeedback: (feedback: { songTitle: string; rating: number; comment: string; expertName: string; }) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onNewFeedback }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const chatSession = createChatSession();
        setChat(chatSession);

        // Send a simple "Hello" to elicit the initial greeting from the system prompt.
        const initialResponse = await chatSession.sendMessage({ message: "Hello" });
        
        setMessages([{
          role: 'model',
          content: initialResponse.text,
        }]);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setMessages([{
          role: 'model',
          content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    if (isChatOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isChatOpen]);

  const parseAndSubmitFeedback = (text: string) => {
    const feedbackRegex = /Song:\s*(.*?)\s*\|\s*Rating:\s*(\d{1,2})\s*\|\s*Comment:\s*(.*?)\s*\|\s*Expert:\s*(.*)/i;
    const match = text.match(feedbackRegex);

    if (match) {
      const [, songTitle, ratingStr, comment, expertName] = match;
      const rating = parseInt(ratingStr, 10);
      
      if (songTitle && !isNaN(rating) && rating >= 1 && rating <= 10 && comment) {
        onNewFeedback({
          songTitle: songTitle.trim(),
          rating,
          comment: comment.trim(),
          expertName: expertName.trim() || 'Anonymous',
        });
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: userInput });
      const modelMessage: ChatMessage = { role: 'model', content: response.text };
      setMessages(prev => [...prev, modelMessage]);

      // Only parse for feedback on responses to user input, not the initial greeting.
      parseAndSubmitFeedback(response.text);

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "Oops, something went wrong. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 z-50"
        aria-label="Toggle Listening Room Assistant"
      >
        {isChatOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] bg-slate-800/80 backdrop-blur-md rounded-lg shadow-2xl flex flex-col z-40">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Listening Room Assistant</h3>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white">
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-gray-200 rounded-bl-none'
                }`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-gray-200 p-3 rounded-lg rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-slate-700">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="bg-cyan-500 text-white rounded-full p-3 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
