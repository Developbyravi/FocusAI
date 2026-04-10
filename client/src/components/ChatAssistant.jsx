import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/focusApi';

const QUICK_Q = [
  'What are the main takeaways?',
  'How does this relate to my goal?',
  'Explain this in simple terms',
  'What should I learn next?',
];

export default function ChatAssistant({ context }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Need help understanding this? I've read the content — ask me anything and I'll explain it clearly. 🧠",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const userMsg = { role: 'user', content: msg };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const data = await sendChatMessage(next, context);
      setMessages((p) => [...p, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((p) => [...p, { role: 'assistant', content: `Sorry, something went wrong: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden fade-in-up">
      {/* Header toggle */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 transition-colors"
        style={{ borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(99,102,241,0.2)' }}>
            🤖
          </div>
          <div className="text-left">
            <h3 className="text-white font-semibold text-sm">AI Learning Assistant</h3>
            <p className="text-slate-500 text-xs">Need help understanding this?</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #34d399' }}/>
          <span className="text-slate-600 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="slide-down">
          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mr-2 mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                    AI
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bubble-user' : 'bubble-assist'}`}
                  style={msg.role === 'user'
                    ? { background: 'rgba(99,102,241,0.25)', color: '#e2e8f0', borderRadius: '16px', borderBottomRightRadius: '4px', border: '1px solid rgba(99,102,241,0.3)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mr-2"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>AI</div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${i*0.15}s` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick questions */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="w-full text-xs text-slate-600 pt-2 mb-1">Quick questions:</p>
            {QUICK_Q.map((q) => (
              <button key={q} onClick={() => send(q)}
                className="px-2.5 py-1 rounded-full text-xs transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <input type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask anything about this content…"
              className="input-field flex-1 px-3 py-2 text-sm"/>
            <button onClick={() => send()} disabled={!input.trim() || loading}
              className="btn-primary px-4 py-2 text-sm">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
