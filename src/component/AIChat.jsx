import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hii, welcome to AutoZoneX website. Tell me, how may I help you?' }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_backendapi}/api/ai/chat`, {
                message: input
            });
            setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, we don't have this information right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999]">
            {/* Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-[#0da6f2] hover:bg-blue-600 p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 text-white"
                >
                    <MessageCircle size={24} className="md:w-7 md:h-7" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-[#121212] w-[90vw] sm:w-[350px] h-[70vh] sm:h-[500px] rounded-2xl shadow-2xl flex flex-col border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="bg-[#0da6f2] p-4 flex justify-between items-center text-white shrink-0">
                        <div>
                            <h3 className="font-black italic text-base md:text-lg uppercase">AUTOZONEX AI</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <p className="text-[10px] uppercase tracking-tighter">Expert System Online</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="bg-black/20 hover:bg-black/40 p-1.5 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-[#121212]">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-[#0da6f2] text-white rounded-tr-none shadow-lg' 
                                    : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10 shadow-inner'
                                }`}>
                                    {/* Markdown rendering logic */}
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown 
                                            components={{
                                                ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                                                li: ({node, ...props}) => <li className="marker:text-[#0da6f2]" {...props} />,
                                                p: ({node, ...props}) => <p className="m-0" {...props} />,
                                                a: ({node, ...props}) => <a className="text-[#0da6f2] underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none animate-pulse text-[#0da6f2] text-xs font-bold">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about car specs or prices..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0da6f2] placeholder:text-gray-500"
                        />
                        <button type="submit" className="bg-[#0da6f2] text-white p-3 rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};


export default AIChat;
