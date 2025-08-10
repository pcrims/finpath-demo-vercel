import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const APP_KEY = "finpath:runner:v1.4";

const THEMES = {
  foundations: { hue:"#D8FF3F" },
  "investing-basics": { hue:"#B8E62E" },
  advanced: { hue:"#D8FF3F" }
};

function load(){ try{ return JSON.parse(localStorage.getItem(APP_KEY))||null; }catch{ return null; } }
function save(s){ try{ localStorage.setItem(APP_KEY, JSON.stringify(s)); }catch{} }
function clsx(...c){ return c.filter(Boolean).join(" "); }

// Build 25 lessons per chapter (placeholder content; to be expanded)
function makeLessons(prefix, baseXp=10){
  const items = [];
  for(let i=1;i<=25;i++){
    items.push({
      id:`${prefix}-${i}`,
      title:`${prefix.replace(/-/g,' ')} — Lesson ${i}`,
      xp: baseXp,
      body:[
        "Placeholder instructional copy. This will be replaced with researched Canadian content and examples.",
        "Each lesson targets a 3–5 minute read with 2 quick checks and a 'learn more' link."
      ],
      learnMore:[{label:"OSC – GetSmarterAboutMoney", href:"https://www.getsmarteraboutmoney.ca/"}],
      quiz:[{q:"I understand the key idea from this lesson.", labels:["True","False"]},{q:"I could explain it to a friend.", labels:["True","False"]}]
    });
  }
  return items;
}

const TRACKS = [
  { id:"foundations", name:"Foundations", chapters:[
    { id:"mindset", title:"Money Mindset & Habits", lessons: makeLessons("mindset", 10) },
    { id:"budgeting", title:"Budgeting Basics", lessons: makeLessons("budgeting", 10) }
  ]},
  { id:"investing-basics", name:"Investing Basics", chapters:[
    { id:"registered-accounts", title:"Registered Accounts", lessons: makeLessons("registered", 15) },
    { id:"portfolio-basics", title:"Portfolio Basics", lessons: makeLessons("portfolio", 15) }
  ]},
  { id:"advanced", name:"Advanced & Strategy", chapters:[
    { id:"tax-efficiency", title:"Tax Efficiency", lessons: makeLessons("tax", 15) },
    { id:"tactics", title:"Allocation & Tactics", lessons: makeLessons("tactics", 15) }
  ]}
];

function Card({children,className,style}){ return <div className={clsx("card", className)} style={style}>{children}</div>; }
function Button({children,onClick,variant="primary",className,disabled}){
  const base="btn text-sm";
  const styles={ primary:"btn-primary", outline:"btn-outline", ghost:"btn-ghost" }[variant];
  return <button disabled={disabled} onClick={onClick} className={clsx(base, styles, className)}>{children}</button>;
}
function ProgressBar({value}){ return <div className="w-full h-2 rounded-full bg-black/10"><div className="h-2 rounded-full bg-black" style={{width:`${Math.min(100,Math.max(0,value))}%`}}/></div>; }

function Header({onNav}){
  const [open,setOpen]=useState(false);
  const nav=[{k:"home",label:"Home"},{k:"tracks",label:"Tracks"},{k:"progress",label:"Progress"},{k:"account",label:"Account"}];
  return <div className="sticky top-0 z-40 backdrop-blur bg-white/80">
    <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-black"/><span className="font-black tracking-tight text-lg">FinPath</span></div>
      <div className="hidden md:flex items-center gap-2">{nav.map(n=>(<Button key={n.k} variant="ghost" onClick={()=>onNav(n.k)}>{n.label}</Button>))}</div>
      <button className="md:hidden p-2 rounded-lg" onClick={()=>setOpen(true)} aria-label="Open menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="16" width="18" height="2" rx="1"/></svg>
      </button>
    </div>
    <AnimatePresence>{open && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="md:hidden fixed inset-0 z-50 bg-black/40" onClick={()=>setOpen(false)}>
      <motion.div initial={{y:-12,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-12,opacity:0}} className="bg-white rounded-b-2xl p-3 pb-5" onClick={(e)=>e.stopPropagation()}>
        {nav.map(n=>(<button key={n.k} onClick={()=>{onNav(n.k); setOpen(false);}} className="w-full text-left px-3 py-3 rounded-xl hover:bg-black/5">{n.label}</button>))}
      </motion.div>
    </motion.div>)}</AnimatePresence>
  </div>;
}

// Deterministic SVG illustrations per seed (neon accent)
function Illustration({ seed="x" }){
  const code = [...seed].reduce((a,c)=>a+c.charCodeAt(0),0);
  const colors = ["#000","#2F3337","#D8FF3F","#B8E62E"];
  const N=6; const shapes=[];
  for(let i=0;i<N;i++){
    const r=((code*(i+3))%100)/100;
    shapes.push({ x:8+r*80, y:12+((code*i)%50), w:20+((code*i)%30), h:8+((code*(i+7))%18), c:colors[i%colors.length], rx:10 });
  }
  return <svg viewBox="0 0 100 70" className="w-full h-40 round-big" aria-hidden>
    <rect x="0" y="0" width="100" height="70" fill="#F3F4F6" rx="18" />
    {shapes.map((s,i)=>(<rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.c} rx={s.rx} opacity=".9" />))}
    <circle cx={(code%60)+20} cy="18" r="6" fill="#D8FF3F" />
  </svg>;
}

// Onboarding questionnaire
function SwipeCard({ text, onSwipeLeft, onSwipeRight }){
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 0, 160], [-10, 0, 10]);
  const threshold = 120; const power = 800;
  const fling = (dir)=>{ const target = (dir>0 ? window.innerWidth : -window.innerWidth) + 240; x.stop(); x.set(target); dir>0?onSwipeRight():onSwipeLeft(); setTimeout(()=>x.set(0),0); };
  return <div className="relative">
    <motion.div style={{ x, rotate }} className="card p-6 sm:p-8" drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.2}
      onDragEnd={(e, info)=>{ const X=info.offset.x, V=info.velocity.x; if(X>threshold||V>power){ fling(1); } else if(X<-threshold||V<-power){ fling(-1);} else { x.set(0);} }}>
      <div className="min-h-[120px] sm:min-h-[140px] flex items-center"><h2 className="text-xl sm:text-2xl font-black tracking-tight">{text}</h2></div>
    </motion.div>
  </div>;
}

function Questionnaire({ questions, onFinish }){
  const [i,setI]=useState(0); const [answers,setAnswers]=useState([]);
  const q=questions[i]; const done=i>=questions.length;
  useEffect(()=>{ const s=load(); if(s?.quiz){ setI(questions.length); setAnswers(s.quiz.answers||[]);} },[]);
  useEffect(()=>{ const current=load()||{}; const score=answers.filter(Boolean).length; save({...current, quiz:{answers,score}}); },[answers]);
  const record=(val)=>{ const next=[...answers]; next[i]=val; setAnswers(next); setI(i+1); };
  if(done) return <div className="max-w-sm mx-auto px-5 py-14"><Card className="p-8 text-center"><div className="text-6xl mb-2">🧭</div><h2 className="text-2xl font-black mb-2">You're set!</h2><p className="text-muted mb-4">We’ll recommend a starting point based on your answers.</p><Button onClick={()=>onFinish(answers.filter(Boolean).length)}>See recommendation</Button></Card></div>;
  return <div className="max-w-sm mx-auto px-5 py-12 select-none">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="chip">Question {i+1}/{questions.length}</span>
      </div>
      <div className="w-40"><ProgressBar value={(i/questions.length)*100} /></div>
    </div>
    <SwipeCard key={q.text} text={q.text} onSwipeLeft={()=>record(false)} onSwipeRight={()=>record(true)} />
    <div className="mt-6 grid grid-cols-2 gap-3">
      <Button onClick={()=>record(true)}>Yes</Button>
      <Button variant="outline" onClick={()=>record(false)}>No</Button>
    </div>
    <div className="mt-3 text-center text-xs text-muted">Tip: drag the card <span className="kbd">→</span> for Yes or <span className="kbd">←</span> for No</div>
  </div>;
}

function Home({ onContinue }){
  return <div className="max-w-6xl mx-auto px-5 py-10">
    <div className="grid md:grid-cols-2 gap-6 items-stretch">
      <Card className="p-7 md:p-10">
        <div className="chip inline-block mb-3 bg-neon">Mobile-first learning</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Your money, made clear.</h1>
        <p className="text-muted max-w-md">Continue where you left off, or start a track tailored to your goals.</p>
        <div className="mt-6 flex gap-3"><Button onClick={onContinue}>Continue learning</Button><Button variant="outline" onClick={onContinue}>Browse tracks</Button></div>
      </Card>
      <Card className="p-0 overflow-hidden"><Illustration seed="hero" /></Card>
    </div>
  </div>;
}

function Tracks({ tracks, onEnterTrack }){
  return <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-3 gap-6">
    {tracks.map(t=>{
      return (<Card key={t.id} className="overflow-hidden">
        <div className="h-2 w-full neon" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">{t.name}</h3>
            <span className="chip">Track</span>
          </div>
          <p className="text-muted text-sm mb-4">{t.chapters.length} chapters • {t.chapters.reduce((a,c)=>a+c.lessons.length,0)} lessons</p>
          <Illustration seed={t.id} />
          <div className="mt-4"><Button onClick={()=>onEnterTrack(t.id)}>Start track</Button></div>
        </div>
      </Card>);
    })}
  </div>;
}

function RunnerHeader({ title, step, total, onQuit }){
  const pct = Math.round((step/Math.max(1,total))*100);
  return <div className="sticky top-0 z-30 backdrop-blur bg-white/85">
    <div className="max-w-4xl mx-auto px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="font-bold truncate">{title}</div>
        <button onClick={onQuit} className="chip">Quit</button>
      </div>
      <div className="mt-2"><ProgressBar value={pct} /></div>
      <div className="mt-1 text-xs text-muted">{step} / {total}</div>
    </div>
  </div>;
}

function TrackRunner({ track, onDone, onQuit, updateResume, awardXp }){
  const lessons = track.chapters.flatMap(c=> c.lessons.map(l=> ({...l, _cid:c.id, _cTitle:c.title})));
  const [idx,setIdx]=useState(()=>{ const s = load(); const ref = s?.runner?.[track.id]?.index ?? 0; return Math.min(Math.max(0, ref), lessons.length-1); });
  useEffect(()=>{ const s=load()||{}; save({...s, runner:{ ...(s.runner||{}), [track.id]:{ index: idx } }}); },[idx, track.id]);
  useEffect(()=>{ updateResume && updateResume({ tid: track.id, cid: lessons[idx]._cid, lid: lessons[idx].id }); },[idx, track.id]);
  useEffect(()=>{ window.scrollTo({ top: 0, behavior: "auto" }); },[idx]);
  const current = lessons[idx]; const total = lessons.length; const done = idx >= total;
  if(done) return <div className="max-w-3xl mx-auto px-5 py-16"><Card className="p-8 text-center"><div className="text-6xl mb-2">🏁</div><h3 className="text-xl font-bold">Track complete</h3><p className="text-muted mb-4">Great run through {track.name}.</p><Button onClick={onDone}>Back to Tracks</Button></Card></div>;
  return <div>
    <RunnerHeader title={`${track.name} • ${current._cTitle}`} step={idx+1} total={total} onQuit={onQuit} />
    <LessonInline key={current.id} lesson={current} onFinish={(earnedXp)=>{ awardXp(earnedXp); if(idx+1<total){ setIdx(idx+1); } else { onDone(); } }} />
  </div>;
}

function LessonInline({ lesson, onFinish }){
  const [answers,setAnswers]=useState({});
  const [complete,setComplete]=useState(false);
  const [show,setShow]=useState(false);
  useEffect(()=>{ setAnswers({}); setComplete(false); setShow(false); window.scrollTo({ top:0, behavior:"auto" }); },[lesson?.id]);
  const total = (lesson.quiz||[]).length;
  const allAnswered = (lesson.quiz||[]).every((_,i)=>answers[i]===0||answers[i]===1);
  const choose=(i,idx)=> setAnswers(p=>({...p,[i]:idx}));
  const finish=()=>{ if(!complete && allAnswered){ setComplete(true); setShow(true); } else { setShow(true); } };
  const correct = (lesson.quiz||[]).reduce((acc,q,i)=> acc + ((answers[i]??-1)===0?1:0), 0);
  return <div className="max-w-4xl mx-auto px-5 py-8">
    <Card className="overflow-hidden">
      <Illustration seed={lesson.id} />
      <div className="p-7">
        <div className="mb-1 text-xs uppercase tracking-wide text-muted">{lesson.title}</div>
        <div className="prose max-w-none">{(lesson.body||[]).map((p,i)=>(<p key={i} className="text-[15px]">{p}</p>))}</div>
        {Array.isArray(lesson.learnMore)&&lesson.learnMore.length>0 && (<div className="mt-4 flex flex-wrap gap-3">{lesson.learnMore.map((l,i)=>(<a key={i} href={l.href} target="_blank" rel="noreferrer" className="link text-sm">{l.label}</a>))}</div>)}
      </div>
    </Card>
    <Card className="p-6 mt-6">
      <div className="flex items-center justify-between mb-3"><h3 className="font-bold">Quick Check</h3><span className="chip neon">+{lesson.xp||10} XP</span></div>
      {(lesson.quiz||[]).map((q,i)=>(
        <div key={i} className="mb-4">
          <p className="mb-2">{q.q || q}</p>
          <div className="grid grid-cols-2 gap-2">
            {[0,1].map(idx=>(
              <Button key={idx} onClick={()=>choose(i,idx)} variant={(answers[i]===idx)?"primary":"outline"} aria-pressed={answers[i]===idx}>
                {(q.labels&&q.labels[idx]) || (idx===0?"Yes":"No")}
              </Button>
            ))}
          </div>
          {answers[i]!==undefined && (
            <div className="mt-2 text-sm">{answers[i]===0 ? <span className="text-emerald-600">Correct</span> : <span className="text-rose-600">Incorrect</span>}</div>
          )}
        </div>
      ))}
      <div className="mt-4"><Button onClick={finish} disabled={!allAnswered && !complete}>{complete? "View Results" : "Finish Lesson"}</Button></div>
    </Card>

    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/40 grid place-items-center">
          <Card className="p-6 max-w-md w-[92vw]">
            <div className="text-center space-y-2">
              <div className="text-5xl">🎉</div>
              <h3 className="text-xl font-bold">Nice work!</h3>
              <p className="text-muted">{correct} / {total} correct. {Math.round((correct/Math.max(1,total))*100)}%</p>
              <div className="flex gap-2 justify-center pt-2">
                <Button onClick={()=>{ setShow(false); onFinish(lesson.xp||10); }}>Continue</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  </div>;
}

function useGame(){
  const [game,setGame]=useState(()=> (load()?.game) || { xp:0, streak:0, lastActive:null, badges:[], weekly: { target:5, completed:0 }, lastActiveRef:null });
  useEffect(()=>{ const today=new Date().toDateString(); const y=new Date(Date.now()-86400000).toDateString(); if(game.lastActive!==today){ const n=game.lastActive===y?(game.streak||0)+1:1; setGame(g=>({ ...g, lastActive:today, streak:n })); } },[]);
  useEffect(()=>{ const s=load()||{}; save({...s, game}); },[game]);
  const awardXp = (amt)=> setGame(g=>({ ...g, xp:(g.xp||0)+amt, badges: Array.from(new Set([...(g.badges||[]), "First Steps"])).filter(Boolean) }));
  const setLastActiveRef = (ref)=> setGame(g=>({ ...g, lastActiveRef: ref }));
  return { game, awardXp, setLastActiveRef };
}

export default function App(){
  const [route,setRoute]=useState("home");
  const [activeTrackId,setActiveTrackId]=useState(null);
  const { game, awardXp, setLastActiveRef } = useGame();

  const getTrack = (id)=> TRACKS.find(t=>t.id===id);
  const lastRef = load()?.game?.lastActiveRef;

  useEffect(()=>{ const s=load(); if(!s?.quiz) setRoute("quiz"); },[]);

  const continueLearning = ()=>{
    if(lastRef){
      setActiveTrackId(lastRef.tid);
      setRoute("runner");
    }else{
      setRoute("tracks");
    }
  };

  return <div className="min-h-screen">
    <Header onNav={(r)=>setRoute(r)} />

    {route==="quiz" && <Questionnaire questions={[
      { text: "Do you keep a monthly budget?" },
      { text: "Do you have an emergency fund?" },
      { text: "Do you know the difference between a TFSA and an RRSP?" },
      { text: "Have you bought stocks, ETFs, or mutual funds before?" },
      { text: "Do you understand diversification?" }
    ]} onFinish={()=>setRoute("home")} />}

    {route==="home" && <Home onContinue={continueLearning} />}

    {route==="tracks" && <Tracks tracks={TRACKS} onEnterTrack={(tid)=>{ setActiveTrackId(tid); setRoute("runner"); }} />}

    {route==="runner" && activeTrackId && (
      <TrackRunner
        track={getTrack(activeTrackId)}
        awardXp={(xp)=>awardXp(xp)}
        updateResume={(ref)=> setLastActiveRef(ref)}
        onQuit={()=> setRoute("tracks")}
        onDone={()=> setRoute("progress")}
      />
    )}

    {route==="progress" && (
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-black tracking-tight">Progress</h2><Button variant="outline" onClick={()=>setRoute("home")}>Back</Button></div>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 col-span-2"><p className="text-sm text-muted mb-2">XP</p><div className="text-3xl font-black">{game.xp||0}</div></Card>
          <Card className="p-6"><p className="text-sm text-muted mb-2">Streak</p><div className="text-3xl font-black">{game.streak||1}d</div></Card>
          <Card className="p-6"><p className="text-sm text-muted mb-2">Last track</p><div className="text-sm">{lastRef? lastRef.tid : "—"}</div></Card>
        </div>
      </div>
    )}

    <div className="max-w-6xl mx-auto px-5 pb-12"><div className="mt-8 text-xs text-muted">Education only. Not financial advice.</div></div>
  </div>;
}
