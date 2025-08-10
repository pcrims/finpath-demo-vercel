'use client';
import React from 'react';

export default function ProgressCircle({ value = 0, size = 48, stroke = 6 }) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c - (clamped / 100) * c;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          stroke="url(#g)"
          strokeLinecap="round"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={dash}
          style={{ transition: 'stroke-dashoffset .3s ease' }}
        />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7dd3fc"/>
            <stop offset="100%" stopColor="#4ca0ff"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
