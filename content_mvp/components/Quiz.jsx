'use client';
import React, { useState } from 'react';

export default function Quiz({ items = [] }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!items || items.length === 0) return null;
  const q = items[0]; // single quick check per lesson for MVP

  const isCorrect = submitted && selected === q.answer;

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h3>Quick Check</h3>
      <p style={{ marginBottom: 8 }}>{q.q}</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {q.choices.map((c, idx) => (
          <label key={idx} className="card" style={{ padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="radio"
              name="q"
              checked={selected === idx}
              onChange={() => setSelected(idx)}
            />
            <span>{c}</span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={() => setSubmitted(true)} disabled={selected === null}>Submit</button>
        {submitted && (
          <span className="badge" style={{ borderColor: isCorrect ? 'rgba(34,197,94,.5)' : 'rgba(245,158,11,.5)', background: isCorrect ? 'rgba(34,197,94,.12)' : 'rgba(245,158,11,.12)' }}>
            {isCorrect ? 'Correct' : 'Try again'}{!isCorrect && q.explain ? ` — ${q.explain}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
