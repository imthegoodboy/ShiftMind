import React, { useState } from 'react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hi! Ask me about trading strategies or swaps.' },
  ]);
  const [input, setInput] = useState('');

  function speak(text: string) {
    try {
      if ('speechSynthesis' in window) {
        const uttr = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(uttr);
      }
    } catch {}
  }

  function generateReply(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('strategy')) return 'Safe: low risk; Aggressive: high return; Stable: balanced.';
    if (q.includes('swap')) return 'Use Swaps page or Manual Swap to execute a trade.';
    if (q.includes('sideshift')) return 'We fetch quotes and execute via SideShift.ai API.';
    return 'I can help with strategies, swaps, and SideShift usage.';
  }

  function send() {
    if (!input.trim()) return;
    const reply = generateReply(input.trim());
    setMessages(prev => [...prev, { role: 'user', text: input.trim() }, { role: 'bot', text: reply }]);
    speak(reply);
    setInput('');
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
        aria-label="Open chatbot"
      >
        💬
      </button>
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-80 max-w-[90vw] rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-white/10">
            <p className="font-semibold">AI Trading Assistant</p>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-300">✕</button>
          </div>
          <div className="max-h-80 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.role === 'bot' ? 'text-blue-100' : 'text-gray-200'}`}>
                <span className="font-semibold mr-1">{m.role === 'bot' ? 'Bot:' : 'You:'}</span>
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-3 bg-white/5">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about swaps or strategies"
              className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-sm"
            />
            <button onClick={send} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm">Send</button>
          </div>
        </div>
      )}
    </>
  );
}


