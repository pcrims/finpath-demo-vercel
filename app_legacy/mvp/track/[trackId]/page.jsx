import Link from 'next/link';
import ProgressCircle from '../../../components/ProgressCircle';
import { use } from 'react';

export async function generateStaticParams() {
  const data = await import('../../../data/content.json');
  return (data.default || data).tracks.map(t => ({ trackId: t.id }));
}

async function getTrack(trackId) {
  const data = await import('../../../data/content.json');
  const tracks = (data.default || data).tracks;
  return tracks.find(t => t.id === trackId);
}

export default function TrackPage({ params }) {
  const track = use(getTrack(params.trackId));
  const lessons = track.lessons;

  return (
    <main>
      <Link href="/" className="meta">← All tracks</Link>
      <div className="hug">
        <div>
          <h1>{track.title}</h1>
          <p className="meta">{lessons.length} lessons</p>
        </div>
        <ProgressClient trackId={track.id} total={lessons.length} />
      </div>

      <div className="grid">
        {lessons.map((l, idx) => (
          <Link key={idx} href={`/track/${track.id}/lesson/${idx}`} className="card">
            <h2>{l.title}</h2>
            <p className="meta">Lesson {idx + 1}</p>
            <p style={{ marginTop: 8 }}>{l.hook}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

function ProgressClient({ trackId, total }) {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('fin-ed-progress');
  const progress = raw ? JSON.parse(raw) : {};
  const done = Object.keys(progress).filter(k => k.startsWith(trackId + ':')).length;
  const pct = Math.round((done / total) * 100);
  return <ProgressCircle value={pct} />;
}
