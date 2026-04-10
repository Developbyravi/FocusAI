import React, { useState } from 'react';

export default function VideoPlayer({ embedUrl, title, videoId, fallbackMessage }) {
  const [playing, setPlaying] = useState(false);

  if (!embedUrl) return null;

  return (
    <div className="card overflow-hidden fade-in-up">
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
            title={title} frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer group"
            style={{ background: '#0d1117' }}
            onClick={() => setPlaying(true)}>
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.35 }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            {/* Play button */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: 'rgba(239,68,68,0.9)', boxShadow: '0 0 30px rgba(239,68,68,0.4)' }}>
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="text-white text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)' }}>
                Click to play
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white text-sm font-medium truncate flex-1 mr-3">{title}</p>
        {fallbackMessage && (
          <span className="pill flex-shrink-0 text-xs"
            style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', color: '#fb923c' }}>
            ⚠️ Captions used
          </span>
        )}
      </div>
    </div>
  );
}
