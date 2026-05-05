import React, { useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { RiRobot2Line } from 'react-icons/ri';
import { api } from '../../config/api';

export default function ChatbotSidebar({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Ask me about universities, reviews, ratings, or platform data. I will use database context and Groq to answer.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(api.chatbot.message, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(-8)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get chatbot response');
      }

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: data.reply }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: error.message || 'Something went wrong.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={`fixed right-0 top-0 z-40 h-screen w-full max-w-md border-l border-[#004F4F] bg-[#0A0A0A]/95 backdrop-blur-xl shadow-2xl shadow-black/40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-[#004F4F] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#00FF00]/10 text-[#00FF00]">
              <RiRobot2Line className="text-xl" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Universe Chatbot</h3>
              <p className="text-xs text-[#888888]">Groq-powered RAG assistant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#888888] transition hover:bg-[#004F4F]/30 hover:text-white"
            aria-label="Close chatbot"
          >
            <IoMdClose className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-[#00FF00] text-dark-black'
                      : 'bg-white/5 text-[#E5E7EB] border border-[#004F4F]/60'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[#004F4F]/60 bg-white/5 px-4 py-3 text-sm text-[#E5E7EB]">
                  Thinking with database context...
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className="border-t border-[#004F4F] p-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about universities or reviews..."
              rows={3}
              className="min-h-20 flex-1 resize-none rounded-2xl border border-[#004F4F] bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#666666] focus:border-[#00FF00]/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="self-end rounded-2xl bg-[#00FF00] px-4 py-3 text-sm font-semibold text-dark-black transition hover:bg-[#00dd00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}