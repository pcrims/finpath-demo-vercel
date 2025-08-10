'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Quiz from '../../../components/Quiz';
import ProgressCircle from '../../../components/ProgressCircle';
import { useProgress } from '../../../components/LessonParts';

async function getData() {
  const data = await import('../../../data/content.json');
  return data.default || data;
}

export default function LessonPage({ params }) {
  const data = use(getData());
  const track = data.tracks.find(t => t.id === params.trackId);
  const idx = Number(params.lessonIndex);
  const lesson = track.lessons[idx];
  const { markComplete, isDone } = useProgress();
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isDone(track.id, idx));
  }, [isDone, track.id, idx]);

  const prevHref = idx > 0 ? `/track/${track.id}/lesson/${idx-1}` : `/track/${track.id}`;
  const nextHref = idx < track.lessons.length - 1 ? `/track/${track.id}/lesson/${idx+1}` : `/track/${track.id}`;

  return (
    <main>
      <div className="hug">
        <div>
          <Link href={`/track/${track.id}`} className="meta">← {track.title}</Link>
          <h1>{lesson.title}</h1>
          <p className="meta">Lesson {idx + 1} of {track.lessons.length}</p>
        </div>
        <ProgressCircle value={done ? 100 : 0} />
      </div>

      <div className="card">
        <h3>Hook</h3>
        <p>{lesson.hook}</p>
        <h3>What it is</h3>
        <p>{lesson.what}</p>
        <h3>Why it matters</h3>
        <p>{lesson.why}</p>
        <h3>How to apply it</h3>
        <ul className="kv">
          {lesson.how.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
        <h3>Example</h3>
        <p>{lesson.example}</p>
        <h3>Key Takeaways</h3>
        <ul className="kv">
          {lesson.takeaways.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
        {lesson.learnMore && lesson.learnMore.length > 0 && (
          <div className="section">
            <h3>Learn More</h3>
            <ul className="kv">
              {lesson.learnMore.map((l, i) => <li key={i}>{l.label}{l.url ? ' — ' : ''}{l.url ? <a href={l.url} target="_blank" rel="noreferrer">{l.url}</a> : ''}</li>)}
            </ul>
          </div>
        )}
      </div>

      <Quiz items={lesson.quiz} />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={() => { markComplete(track.id, idx); setDone(true); }}>Mark complete</button>
        <Link className="btn secondary" href={prevHref}>Back</Link>
        <Link className="btn" href={nextHref}>Next</Link>
      </div>
    </main>
  );
}
