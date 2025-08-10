import Link from 'next/link';
import ProgressCircle from '../../../components/ProgressCircle';
import { use } from 'react';

async function getData() {
  const data = await import('../../../data/content.json');
  return data.default || data;
}

export default function Home() {
  const data = use(getData());
  return (
    <main>
      <div className="hug">
        <div>
          <h1>Financial Education — MVP</h1>
          <p className="meta">Three learning tracks. Start anywhere, come back anytime. Your progress is saved on this device.</p>
        </div>
      </div>

      <div className="grid">
        {data.tracks.map((t) => (
          <Link key={t.id} href={`/track/${t.id}`} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>{t.title}</h2>
                <p className="meta">{t.lessons.length} lessons • ~{t.lessons.length * 6}–{t.lessons.length * 10} min</p>
              </div>
              <ProgressClient trackId={t.id} total={t.lessons.length} />
            </div>
            <p style={{ marginTop: 8 }}>{t.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

function ProgressClient({ trackId, total }) {
  // Client-only small wrapper to show progress circle pulled from localStorage
  return (
    <div suppressHydrationWarning>
      <ClientRing trackId={trackId} total={total} />
    </div>
  );
}

function ClientRing({ trackId, total }) {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('fin-ed-progress');
  const progress = raw ? JSON.parse(raw) : {};
  const done = Object.keys(progress).filter(k => k.startsWith(trackId + ':')).length;
  const pct = Math.round((done / total) * 100);
  return <ProgressCircle value={pct} />;
}
