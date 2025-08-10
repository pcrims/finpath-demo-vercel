'use client';
import React, { useEffect, useState } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('fin-ed-progress');
    setProgress(raw ? JSON.parse(raw) : {});
  }, []);

  const markComplete = (trackId, lessonIndex) => {
    const key = `${trackId}:${lessonIndex}`;
    const next = { ...progress, [key]: true };
    setProgress(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fin-ed-progress', JSON.stringify(next));
    }
  };

  const getTrackPct = (trackId, totalLessons) => {
    const done = Object.keys(progress).filter(k => k.startsWith(trackId + ':')).length;
    return Math.round((done / totalLessons) * 100);
  };

  const isDone = (trackId, lessonIndex) => !!progress[`${trackId}:${lessonIndex}`];

  return { progress, markComplete, getTrackPct, isDone };
}
