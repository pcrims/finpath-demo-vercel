import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const APP_KEY = "finpath:runner:v1.3";

const THEMES = {
  foundations: { bg:"lemon", accents:["#111","#FF7A59","#1F2937"] },
  "investing-basics": { bg:"lilac", accents:["#111","#6C5CE7","#EF476F"] },
  advanced: { bg:"mint", accents:["#111","#10B981","#111827"] }
};

// Minimal seed content; lessons expanded to 25 per track (bodies concise for now)
function makeLessons(prefix, baseXp=10){
  const items = [];
  for(let i=1;i<=25;i++){
    items.push({
      id:`${prefix}-${i}`,
      title:`${prefix.replace(/-/g,' ')} — Lesson ${i}`,
      xp: baseXp,
      body:[
        "This is placeholder instructional content. In the content pass we’ll expand each lesson with Canadian-specific guidance, examples, and a quick interactive.",
        "Key idea: keep lessons 3–5 minutes, with 2 knowledge checks and 1 ‘learn more’ link to an authoritative Canadian source."],
      learnMore:[{label:"OSC – GetSmarterAboutMoney", href:"https://www.getsmarteraboutmoney.ca/"}],
      quiz:[{q:"I understand the key idea from this lesson.", labels:["True","False"]},{q:"I could explain it to a friend.", labels:["True","False"]}]
    });
  }
  return items;
}

const TRACKS = [
  { id:"foundations", name:"Foundations", color:"#111", chapters:[
    { id:"mindset", title:"Money Mindset & Habits", lessons: makeLessons("mindset", 10) },
    { id:"budgeting", title:"Budgeting Basics", lessons: makeLessons("budgeting", 10) }
  ]},
  { id:"investing-basics", name:"Investing Basics", color:"#111", chapters:[
    { id:"registered-accounts", title:"Registered Accounts", lessons: makeLessons("registered", 15) },
    { id:"portfolio-basics", title:"Portfolio Basics", lessons: makeLessons("portfolio", 15) }
  ]},
  { id:"advanced", name:"Advanced & Strategy", color:"#111", chapters:[
    { id:"tax-efficiency", title:"Tax Efficiency", lessons: makeLessons("tax", 15) },
    { id:"tactics", title:"Allocation & Tactics", lessons: makeLessons("tactics", 15) }
  ]}
];

function load(){ try{ return JSON.parse(localStorage.getItem(APP_KEY))||null; }catch{ return null; } }
function save(s){ try{ localStorage.setItem(APP_KEY, JSON.stringify(s)); }catch{} }
function clsx(...c){ return c.filter(Boolean).join(" "); }

function useTheme(){ const [mode,setMode]=useState("light"); return { theme:mode, setTheme:setMode }; }

function Card({children,className,style}){ return <div className={clsx("card shadow-soft", className)} style={style}>{children}</div>; }
function Button({children,onClick,variant="primary",className,disabled}){
  const base="btn text-sm";
  const styles={ primary:"btn-primary", outline:"btn-outline", ghost:"" }[variant];
  return <button disabled={disabled} onClick={onClick} className={clsx(base, styles, className)}>{children}</button>;
}
function ProgressBar({value}){ return <div className="w-full h-2 rounded-full bg-black/10"><div className="h-2 rounded-full bg-black" style={{width:`${Math.min(100,Math.max(0,value))}%`}}/></div>; }

function Header({onNav}){
  const [open,setOpen]=useState(false);
  const nav=[{k:"home",label:"Home"},{k:"tracks",label:"Tracks"},{k:"progress",label:"Progress"},{k:"account",label:"Account"}];
  return <div className="sticky top-0 z-40 backdrop-blur bg-white/75">
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

// Generative illustration (deterministic by seed + theme palette)
function Illustration({ seed="x", themeKey="foundations" }){
  const theme = THEMES[themeKey] || THEMES.foundations;
  const colors = theme.accents;
  const h = [...seed].reduce((a,c)=>a+c.charCodeAt(0),0);
  const rng = (min,max,i)=>{ const v=Math.sin(h* (i+3.7)) * 43758.5453; const r=v-Math.floor(v); return min + (max-min)*r; };
  const circles = Array.from({length:6}).map((_,i)=>({ x:rng(10,90,i), y:rng(10,90,i+10), r:rng(6,18,i+20), c:colors[i%colors.length] }));
  const rects = Array.from({length:4}).map((_,i)=>({ x:rng(0,70,i+30), y:rng(0,60,i+40), w:rng(20,50,i+50), h:rng(8,22,i+60), c:colors[(i+1)%colors.length], rx:8 }));
  return <svg viewBox="0 0 100 70" className="w-full h-40 rounded-2xl" style={{background:`var(--card)`}} aria-hidden>
    <defs><linearGradient id={`g-${h}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={colors[1]} stopOpacity=".15"/><stop offset="1" stopColor={colors[2]} stopOpacity=".15"/></linearGradient></defs>
    <rect x="0" y="0" width="100" height="70" fill={`url(#g-${h})`} rx="14" />
    {rects.map((r,i)=>(<rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx={r.rx} fill={r.c} opacity=".9" />))}
    {circles.map((c,i)=>(<circle key={i} cx={c.x} cy={c.y} r={c.r} fill={c.c} opacity=".85" />))}
  </svg>;
}

function startOfWeek(date = new Date()) { const d = new Date(date); const day = d.getDay(); const diff = (day===0?-6:1)-day; d.setDate(d.getDate()+diff); d.setHours(0,0,0,0); return d; }
function weekId(date = new Date()){ return startOfWeek(date).toISOString().slice(0,10); }
function defaultWeekly(){ return { weekId: weekId(), target:5, completed:0 }; }
function useGame(){
  const [game,setGame]=useState(()=> (load()?.game) || { xp:0, streak:0, lastActive:null, badges:[], weekly: defaultWeekly(), lastActiveRef:null });
  useEffect(()=>{ const today=new Date().toDateString(); const y=new Date(Date.now()-86400000).toDateString(); if(game.lastActive!==today){ const n=game.lastActive===y?(game.streak||0)+1:1; setGame(g=>({ ...g, lastActive:today, streak:n })); } },[]);
  useEffect(()=>{ const s=load()||{}; save({...s, game}); },[game]);
  const awardXp = (amt)=> setGame(g=>({ ...g, xp:(g.xp||0)+amt, badges: Array.from(new Set([...(g.badges||[]), "First Steps"])).filter(Boolean) }));
  const setLastActiveRef = (ref)=> setGame(g=>({ ...g, lastActiveRef: ref }));
  return { game, awardXp, setLastActiveRef };
}

// Swipe onboarding (no on-card labels)
function SwipeCard({ text, onSwipeLeft, onSwipeRight }){
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 0, 160], [-10, 0, 10]);
  const threshold = 120; const power = 800;
  const fling = (dir)=>{ const target = (dir>0 ? window.innerWidth : -window.innerWidth) + 240; x.stop(); x.set(target); dir>0?onSwipeRight():onSwipeLeft(); setTimeout(()=>x.set(0),0); };
  return <div className="relative">
    <motion.div style={{ x, rotate }} className="card shadow-soft p-6 sm:p-8" drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.2}
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
    <div className="flex items-center justify-between mb-4"><div className="text-sm text-muted">Question {i+1} of {questions.length}</div><div className="w-40"><ProgressBar value={(i/questions.length)*100} /></div></div>
    <SwipeCard key={q.text} text={q.text} onSwipeLeft={()=>record(false)} onSwipeRight={()=>record(true)} />
    <div className="mt-6 grid grid-cols-2 gap-3"><Button onClick={()=>record(true)}>{q.labels?.[0]??"Yes"}</Button><Button variant="outline" onClick={()=>record(false)}>{q.labels?.[1]??"No"}</Button></div>
  </div>;
}

function Home({ onContinue }){
  return <div className="max-w-6xl mx-auto px-5 py-10">
    <div className="grid md:grid-cols-2 gap-6 items-stretch">
      <Card className="p-7 md:p-10 bg-lilac">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Your money, made clear.</h1>
        <p className="text-muted max-w-md">Tap Continue to pick up exactly where you left off, or browse tracks to start a new path.</p>
        <div className="mt-6 flex gap-3"><Button onClick={onContinue}>Continue learning</Button><Button variant="outline" onClick={onContinue}>Browse tracks</Button></div>
      </Card>
      <Card className="p-0 overflow-hidden"><Illustration seed="hero" themeKey="investing-basics" /></Card>
    </div>
  </div>;
}

function Tracks({ tracks, onEnterTrack }){
  return <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-3 gap-6">
    {tracks.map(t=>{
      const theme = THEMES[t.id]||THEMES.foundations;
      return (<Card key={t.id} className="overflow-hidden">
        <div className={clsx("h-2 w-full", `bg-${theme.bg}`)} />
        <div className="p-6">
          <h3 className="font-bold text-lg">{t.name}</h3>
          <p className="text-muted text-sm mb-4">{t.chapters.length} chapters • {t.chapters.reduce((a,c)=>a+c.lessons.length,0)} lessons</p>
          <Illustration seed={t.id} themeKey={t.id} />
          <div className="mt-4"><Button onClick={()=>onEnterTrack(t.id)}>Start track</Button></div>
        </div>
      </Card>);
    })}
  </div>;
}

function RunnerHeader({ title, step, total, onQuit, themeKey="foundations" }){
  const pct = Math.round((step/Math.max(1,total))*100);
  return <div className="sticky top-0 z-30 backdrop-blur bg-white/75">
    <div className="max-w-4xl mx-auto px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="font-bold truncate">{title}</div>
        <button onClick={onQuit} className="text-sm text-muted rounded px-2 py-1">Quit</button>
      </div>
      <div className="mt-2"><ProgressBar value={pct} /></div>
      <div className="mt-1 text-xs text-muted">{step} / {total}</div>
    </div>
  </div>;
}

function TrackRunner({ track, onDone, onQuit, updateResume, awardXp }){
  const themeKey = track.id;
  const lessons = track.chapters.flatMap(c=> c.lessons.map(l=> ({...l, _cid:c.id, _cTitle:c.title})));
  const [idx,setIdx]=useState(()=>{ const s = load(); const ref = s?.runner?.[track.id]?.index ?? 0; return Math.min(Math.max(0, ref), lessons.length-1); });
  useEffect(()=>{ const s=load()||{}; save({...s, runner:{ ...(s.runner||{}), [track.id]:{ index: idx } }}); },[idx, track.id]);
  useEffect(()=>{ updateResume && updateResume({ tid: track.id, cid: lessons[idx]._cid, lid: lessons[idx].id }); },[idx, track.id]);
  useEffect(()=>{ window.scrollTo({ top: 0, behavior: "auto" }); },[idx]);
  const current = lessons[idx]; const total = lessons.length; const done = idx >= total;
  if(done) return <div className="max-w-3xl mx-auto px-5 py-16"><Card className="p-8 text-center bg-mint"><div className="text-6xl mb-2">🏁</div><h3 className="text-xl font-bold">Track complete</h3><p className="text-muted mb-4">Great run through {track.name}.</p><Button onClick={onDone}>Back to Tracks</Button></Card></div>;
  return <div>
    <RunnerHeader title={`${track.name} • ${current._cTitle}`} step={idx+1} total={total} onQuit={onQuit} themeKey={themeKey} />
    <LessonInline key={current.id} themeKey={themeKey} lesson={current} onFinish={(earnedXp)=>{ awardXp(earnedXp); if(idx+1<total){ setIdx(idx+1); } else { onDone(); } }} />
  </div>;
}

function LessonInline({ lesson, onFinish, themeKey }){
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
      <Illustration seed={lesson.id} themeKey={themeKey} />
      <div className="p-7">
        <div className="mb-1 text-xs uppercase tracking-wide text-muted">{lesson.title}</div>
        <div className="prose max-w-none">{(lesson.body||[]).map((p,i)=>(<p key={i} className="text-[15px]">{p}</p>))}</div>
        {Array.isArray(lesson.learnMore)&&lesson.learnMore.length>0 && (<div className="mt-4 flex flex-wrap gap-3">{lesson.learnMore.map((l,i)=>(<a key={i} href={l.href} target="_blank" rel="noreferrer" className="link text-sm">{l.label}</a>))}</div>)}
      </div>
    </Card>
    <Card className="p-6 mt-6">
      <h3 className="font-bold mb-3">Quick Check</h3>
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
          <Card className="p-6 max-w-md w-[92vw] bg-peach">
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
      { text: "Do you keep a monthly budget?", labels: ["Yes","No"] },
      { text: "Do you have an emergency fund?", labels: ["Yes","No"] },
      { text: "Do you know the difference between a TFSA and an RRSP?", labels: ["Yes","No"] },
      { text: "Have you bought stocks, ETFs, or mutual funds before?", labels: ["Yes","No"] },
      { text: "Do you understand diversification?", labels: ["Yes","No"] }
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
