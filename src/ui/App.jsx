import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const APP_KEY = "finpath:pro:v2";

const QUESTIONS = [
  { text: "Do you keep a monthly budget?", labels: ["Yes", "No"] },
  { text: "Do you have an emergency fund?", labels: ["Yes", "No"] },
  { text: "Have you contributed to a TFSA?", labels: ["Yes", "No"] },
  { text: "Do you know the difference between a TFSA and an RRSP?", labels: ["Yes", "No"] },
  { text: "Have you bought stocks, ETFs, or mutual funds before?", labels: ["Yes", "No"] },
  { text: "Do you understand diversification?", labels: ["Yes", "No"] },
  { text: "Have you filed your own taxes?", labels: ["Yes", "No"] },
  { text: "Do you understand how credit scores work?", labels: ["Yes", "No"] },
  { text: "Have you compared MERs/fees between funds?", labels: ["Yes", "No"] },
  { text: "Do you know what an index fund is?", labels: ["Yes", "No"] }
];

const DATA = {
  "foundations": {
    name: "Foundations",
    chapters: [
      { id:"mindset", title:"Money Mindset & Habits", lessons:[
        { id:"why-literacy", title:"Why Financial Literacy Matters in Canada", xp:10,
          body:[
            "Financial literacy is the toolkit for everyday decisions: how you bank, budget, borrow, save, insure, and invest.",
            "Choices like TFSA vs RRSP have tax and cash‑flow consequences. Understanding the basics helps you avoid costly fees and high‑interest debt.",
            "Small actions compound: automatic savings, comparing MERs, and reviewing statements can add thousands over time."
          ],
          learnMore:[
            {label:"FCAC – Financial literacy", href:"https://www.canada.ca/en/financial-consumer-agency.html"},
            {label:"OSC – GetSmarterAboutMoney", href:"https://www.getsmarteraboutmoney.ca/"}
          ],
          quiz:[
            { q:"Learning money skills can help you avoid bank fees.", labels:["True","False"] },
            { q:"Financial literacy only matters if you earn a lot.", labels:["False","True"] }
          ]
        }
      ]},
      { id:"budgeting", title:"Budgeting Basics", lessons:[
        { id:"what-budget", title:"What is a Budget?", xp:10,
          body:[
            "A budget is a forward plan for income and expenses so you see where money goes before it’s gone.",
            "Start simple: list take‑home income, list spending by category, choose targets, and review monthly."
          ],
          learnMore:[{label:"FCAC – Budget planner", href:"https://itools-ioutils.fcac-acfc.gc.ca/BP-PB/budget-planner"}],
          quiz:[
            { q:"A budget only tracks spending.", labels:["False","True"] },
            { q:"Primary purpose of a budget?", labels:["Plan & prioritize","Track receipts"] }
          ]
        }
      ]}
    ]
  },
  "investing-basics": {
    name: "Investing Basics",
    chapters: [
      { id:"registered-accounts", title:"Registered Accounts", lessons:[
        { id:"tfsa-intro", title:"TFSA: Tax‑Free Savings Account", xp:15,
          body:[
            "A TFSA lets investments grow tax‑free; withdrawals are also tax‑free.",
            "Contribution room accumulates annually; withdrawals create room next year."
          ],
          learnMore:[{label:"CRA – TFSA", href:"https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html"}],
          quiz:[
            { q:"TFSA withdrawals are taxable.", labels:["False","True"] },
            { q:"Contribution room returns the same year.", labels:["False","True"] }
          ]
        }
      ]},
      { id:"portfolio-basics", title:"Portfolio Basics", lessons:[
        { id:"risk-return", title:"Risk & Return", xp:10,
          body:["Higher potential returns come with higher volatility; match risk to time horizon."],
          learnMore:[{label:"OSC – Risk & return", href:"https://www.getsmarteraboutmoney.ca/invest/investing-basics/risk/"}],
          quiz:[
            { q:"Stocks usually have more volatility than GICs.", labels:["True","False"] },
            { q:"Higher return with zero risk is common.", labels:["False","True"] }
          ]
        }
      ]},
      { id:"practice", title:"Practice Quiz", practice:true, lessons:[] }
    ]
  },
  "advanced": {
    name: "Advanced & Strategy",
    chapters: [
      { id:"tax-efficiency", title:"Tax Efficiency", lessons:[
        { id:"capital-gains-dividends", title:"Capital Gains & Dividends (Canada)", xp:15,
          body:["Outside registered accounts, capital gains are partially taxable when realized; eligible dividends may get a dividend tax credit."],
          learnMore:[{label:"CRA – Capital gains", href:"https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/capital-gains.html"}],
          quiz:[
            { q:"Gains are taxed when unrealized.", labels:["False","True"] },
            { q:"Eligible dividends may receive a tax credit.", labels:["True","False"] }
          ]
        }
      ]},
      { id:"practice", title:"Practice Quiz", practice:true, lessons:[] }
    ]
  }
};

function buildTracks(){
  const tracks = Object.entries(DATA).map(([id, t])=>({ id, name:t.name, color:"#111111", chapters:t.chapters }));
  tracks.forEach(tr=>{ tr.chapters.forEach(ch=>{ if(ch.practice){ ch.lessons=[{ id:"practice-quiz", title:`${tr.name} — Practice Quiz`, practice:true, xp:25 }]; } }); });
  return tracks;
}

const prefersDark = typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches : false;
function load(){ try{ return JSON.parse(localStorage.getItem(APP_KEY))||null; }catch{ return null; } }
function save(s){ try{ localStorage.setItem(APP_KEY, JSON.stringify(s)); }catch{} }
function clsx(...c){ return c.filter(Boolean).join(" "); }

function useTheme(){
  const [theme,setTheme]=useState(()=> (load()?.theme) || (prefersDark?"dark":"light"));
  useEffect(()=>{ document.documentElement.setAttribute("data-theme", theme); const s=load()||{}; save({...s, theme}); },[theme]);
  return { theme, setTheme };
}

function Card({children,className,style}){
  return <div className={clsx("rounded-2xl shadow-elev", className)} style={{background:"var(--card)", ...style}}>{children}</div>;
}
function Button({children,onClick,variant="primary",className,disabled}){
  const base="focus-ring inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold transition";
  const styles={ primary:"bg-[var(--fg)] text-[var(--bg)] hover:opacity-90", outline:"border border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]", ghost:"text-[var(--fg)] hover:bg-[var(--fg)]/10" }[variant];
  return <button disabled={disabled} onClick={onClick} className={clsx(base, styles, className)}>{children}</button>;
}
function Badge({children}){ return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--fg)] text-[var(--bg)]">{children}</span>; }
function ProgressBar({value}){
  return <div className="w-full h-1.5 rounded-full" style={{background:"color-mix(in oklab, var(--fg) 10%, transparent)"}}><div className="h-1.5 rounded-full" style={{background:"var(--fg)", width:`${Math.min(100,Math.max(0,value))}%`}}/></div>;
}
function ProgressRing({value=0,size=120,stroke=10}){
  const r=(size-stroke)/2; const c=2*Math.PI*r; const dash=`${(value/100)*c} ${c}`;
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><circle cx={size/2} cy={size/2} r={r} stroke="rgba(127,127,127,.25)" strokeWidth={stroke} fill="none"/><circle cx={size/2} cy={size/2} r={r} stroke="var(--fg)" strokeWidth={stroke} strokeLinecap="round" fill="none" strokeDasharray={dash} transform={`rotate(-90 ${size/2} ${size/2})`}/></svg>;
}

function Header({onNav, theme, setTheme}){
  const [open, setOpen] = useState(false);
  const navItems = [
    { k: "home", label: "Home" },
    { k: "tracks", label: "Tracks" },
    { k: "progress", label: "Progress" },
    { k: "account", label: "Account" },
  ];
  return <div className="sticky top-0 z-40 glass shadow-elev">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg" style={{background:"var(--fg)"}}/>
        <span className="font-extrabold tracking-tight text-base sm:text-lg">FinPath</span>
      </div>
      <div className="hidden md:flex items-center gap-2">
        {navItems.map(({k,label})=>(<Button key={k} variant="ghost" onClick={()=>onNav(k)}>{label}</Button>))}
        <Button variant="ghost" onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label="Toggle theme">{theme==="dark"?"Light":"Dark"}</Button>
      </div>
      <button className="md:hidden p-2 rounded-lg focus-ring" aria-label="Open menu" onClick={()=>setOpen(true)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="md:hidden fixed inset-0 z-50" style={{background:"rgba(0,0,0,.45)"}} onClick={()=>setOpen(false)}>
          <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-20, opacity:0}} transition={{type:"spring", stiffness:420, damping:34}} className="glass shadow-elev rounded-b-2xl p-3 pb-4" style={{background:"var(--card)"}} onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-1 py-2">
              <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-lg" style={{background:"var(--fg)"}}/><span className="font-semibold">FinPath</span></div>
              <button className="p-2 rounded-lg focus-ring" aria-label="Close menu" onClick={()=>setOpen(false)}>✕</button>
            </div>
            <div className="mt-2">
              {navItems.map(({k,label})=> (<button key={k} onClick={()=>{ onNav(k); setOpen(false); }} className="w-full text-left px-3 py-3 rounded-xl hover:bg-[var(--fg)]/10">{label}</button>))}
              <div className="px-3 pt-2"><Button variant="outline" onClick={()=>{ setTheme(theme==="dark"?"light":"dark"); setOpen(false); }} className="w-full">{theme==="dark"?"Switch to Light":"Switch to Dark"}</Button></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>;
}

function startOfWeek(date = new Date()) { const d = new Date(date); const day = d.getDay(); const diff = (day===0?-6:1)-day; d.setDate(d.getDate()+diff); d.setHours(0,0,0,0); return d; }
function weekId(date = new Date()){ return startOfWeek(date).toISOString().slice(0,10); }
function defaultWeekly(){ return { weekId: weekId(), target:5, completed:0, tiers:[{target:3,rewardXp:30,awarded:false},{target:5,rewardXp:50,awarded:false},{target:7,rewardXp:100,awarded:false}], done:false }; }
function useGame(){
  const [game,setGame]=useState(()=> (load()?.game) || { xp:0, streak:0, lastActive:null, badges:[], weekly: defaultWeekly(), certificates:[] });
  useEffect(()=>{ const today=new Date().toDateString(); const y=new Date(Date.now()-86400000).toDateString(); if(game.lastActive!==today){ const n=game.lastActive===y?(game.streak||0)+1:1; setGame(g=>({ ...g, lastActive:today, streak:n })); } },[]);
  useEffect(()=>{ if(game.weekly?.weekId!==weekId()) setGame(g=>({ ...g, weekly: defaultWeekly() })); },[]);
  useEffect(()=>{ const s=load()||{}; save({...s, game}); },[game]);
  const awardXp = (amt)=> setGame(g=>({ ...g, xp:(g.xp||0)+amt, badges: Array.from(new Set([...(g.badges||[]), "First Steps", (g.streak>=3?"3-Day Streak":null), ((g.xp||0)+amt>=200?"200 XP Club":null)])).filter(Boolean) }));
  const addCertificate = (cert)=> setGame(g=>({ ...g, certificates:[...(g.certificates||[]), cert] }));
  return { game, awardXp, addCertificate };
}

function buildAllQuestions(tracks, trackId){
  const qs = []; const tr = tracks.find(t=>t.id===trackId); if(!tr) return qs;
  tr.chapters.forEach(ch=>{ (ch.lessons||[]).forEach(ls=>{ if(Array.isArray(ls.quiz)) ls.quiz.forEach(q=>qs.push(q)); }); });
  return qs;
}

function CertificateModal({ open, onClose, trackName, scorePct, onSave }){
  const canvasRef = useRef(null);
  useEffect(()=>{
    if(open){
      const c = canvasRef.current; const ctx = c.getContext("2d");
      const w = c.width = 1200; const h = c.height = 675;
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#fff";
      ctx.fillRect(0,0,w,h);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#000";
      ctx.font = "bold 56px Inter"; ctx.fillText("FinPath Certificate", 60, 120);
      ctx.font = "28px Inter"; ctx.fillText(`Awarded for passing: ${trackName} Practice Quiz`, 60, 200);
      ctx.font = "24px Inter"; ctx.fillText(`Score: ${scorePct}%`, 60, 260);
      ctx.font = "20px Inter"; ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 60, 300);
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 4; ctx.strokeRect(40, 40, w-80, h-80);
    }
  },[open, trackName, scorePct]);
  const download = ()=>{
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a"); a.href = url; a.download = `finpath-certificate-${Date.now()}.png`; a.click();
    onSave && onSave();
  };
  if(!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
    <Card className="p-6 max-w-3xl w-[90vw]">
      <h3 className="text-xl font-semibold mb-3">Congratulations!</h3>
      <p className="text-muted mb-3">You passed the practice quiz for <strong>{trackName}</strong>.</p>
      <canvas ref={canvasRef} className="w-full rounded-lg border mb-4" />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button onClick={download}>Save certificate</Button>
      </div>
    </Card>
  </div>;
}

// --- Swipe Questionnaire with gesture cues ---
function Questionnaire({ questions, onFinish }){
  const [i,setI]=useState(0); const [answers,setAnswers]=useState([]);
  const q=questions[i]; const done=i>=questions.length;
  useEffect(()=>{ const s=load(); if(s?.quiz){ setI(questions.length); setAnswers(s.quiz.answers||[]);} },[]);
  useEffect(()=>{ const current=load()||{}; const score=answers.filter(Boolean).length; save({...current, quiz:{answers,score}}); },[answers]);
  const record=(val)=>{ const next=[...answers]; next[i]=val; setAnswers(next); setI(i+1); };
  if(done) return <div className="max-w-sm mx-auto px-4 py-12 sm:py-16"><Card className="p-8 text-center"><div className="text-6xl mb-2">🧭</div><h2 className="text-2xl font-extrabold mb-2">You're set!</h2><p className="text-muted mb-4">We’ll recommend a starting point based on your answers.</p><Button onClick={()=>onFinish(answers.filter(Boolean).length)}>See recommendation</Button></Card></div>;
  return <div className="max-w-sm mx-auto px-4 py-10 sm:py-14 select-none">
    <div className="flex items-center justify-between mb-4"><div className="text-sm text-muted">Question {i+1} of {questions.length}</div><div className="w-32 sm:w-40"><ProgressBar value={(i/questions.length)*100} /></div></div>
    <SwipeCard key={q.text} text={q.text} onSwipeLeft={()=>record(false)} onSwipeRight={()=>record(true)} leftLabel={q.labels?.[1]??"No"} rightLabel={q.labels?.[0]??"Yes"} />
    <div className="mt-6 grid grid-cols-2 gap-3"><Button onClick={()=>record(true)}>{q.labels?.[0]??"Yes"}</Button><Button variant="outline" onClick={()=>record(false)}>{q.labels?.[1]??"No"}</Button></div>
  </div>;
}
function SwipeCard({ text, onSwipeLeft, onSwipeRight, leftLabel="No", rightLabel="Yes" }){
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 0, 160], [-8, 0, 8]);
  const yesOpacity = useTransform(x, [40, 120], [0, 1]);
  const noOpacity = useTransform(x, [-40, -120], [0, 1]);
  const bgGradient = useTransform(x, [-160, -80, 0, 80, 160], [
    "linear-gradient(180deg, rgba(239,68,68,0.10), transparent)",
    "linear-gradient(180deg, rgba(239,68,68,0.15), transparent)",
    "linear-gradient(180deg, rgba(0,0,0,0), transparent)",
    "linear-gradient(180deg, rgba(16,185,129,0.15), transparent)",
    "linear-gradient(180deg, rgba(16,185,129,0.20), transparent)",
  ]);
  const threshold = 120; const power = 800;
  return <div className="relative">
    <motion.div style={{ x, rotate, backgroundImage: bgGradient }} className="rounded-2xl shadow-elev p-6 sm:p-8" drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.2}
      onDragEnd={(e, info)=>{ const X=info.offset.x, V=info.velocity.x; if(X>threshold||V>power){ onSwipeRight(); x.set(0);} else if(X<-threshold||V<-power){ onSwipeLeft(); x.set(0);} else { x.set(0);} }}
      transition={{ type:"spring", stiffness:420, damping:32 }}>
      <div className="min-h-[120px] sm:min-h-[140px] flex items-center">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{text}</h2>
      </div>
      <motion.div style={{ opacity: yesOpacity }} className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold bg-emerald-500/90 text-white"> {rightLabel} </motion.div>
      <motion.div style={{ opacity: noOpacity }} className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold bg-rose-500/90 text-white"> {leftLabel} </motion.div>
    </motion.div>
    <div className="absolute inset-y-0 left-0 w-10 grid place-items-center pointer-events-none"><span className="text-[10px] text-muted">{leftLabel}</span></div>
    <div className="absolute inset-y-0 right-0 w-10 grid place-items-center pointer-events-none"><span className="text-[10px] text-muted">{rightLabel}</span></div>
  </div>;
}

function Home({ onContinue, weekly }){
  const pct = Math.min(100, (weekly.completed/(weekly.target||5))*100);
  return <div className="max-w-6xl mx-auto px-6 py-12">
    <Card className="p-8 flex items-center justify-between gap-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-muted">Keep your streak alive. Learn real money skills in minutes a day.</p>
        <div className="flex gap-3"><Button onClick={onContinue}>Continue learning</Button><Button variant="outline" onClick={onContinue}>Browse tracks</Button></div>
      </div>
      <div className="hidden md:block text-center">
        <div className="relative grid place-items-center"><ProgressRing value={pct} /><div className="absolute text-sm font-semibold">{Math.round(pct)}%</div></div>
        <p className="mt-3 text-xs text-muted">Weekly challenge</p>
      </div>
    </Card>
  </div>;
}

function Tracks({ tracks, onOpenLesson }){
  return <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
    {tracks.map(t=>(<Card key={t.id} className="p-6">
      <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">{t.name}</h3><div className="w-2 h-2 rounded-full" style={{background:"var(--fg)"}} /></div>
      {t.chapters.map(c=>(<div key={c.id} className="mb-5"><p className="text-xs uppercase tracking-wide text-muted mb-2">{c.title}</p>{(c.lessons||[]).map(l=>(<button key={l.id} onClick={()=>onOpenLesson(t.id,c.id,l.id)} className="w-full text-left py-2 px-3 rounded-xl hover:bg-[var(--fg)]/10 transition">{l.title}</button>))}</div>))}
    </Card>))}
  </div>;
}

function Lesson({ tracks, tid, cid, lid, onExit, onAward, onPracticeSaved }){
  const track = tracks.find(t=>t.id===tid);
  const chapter = track?.chapters.find(c=>c.id===cid);
  const lesson = chapter?.lessons.find(l=>l.id===lid);
  const key = `${APP_KEY}:progress:${tid}:${cid}:${lid}`;
  const [answers,setAnswers]=useState({});
  const [complete,setComplete]=useState(false);
  const [showCert,setShowCert]=useState(false);
  const [scorePct,setScorePct]=useState(0);
  useEffect(()=>{ try{ const s=JSON.parse(localStorage.getItem(key)); if(s?.complete) setComplete(true); if(s?.answers) setAnswers(s.answers);}catch{} },[key]);
  const allAnswered = useMemo(()=> (lesson?.quiz||[]).every((_,i)=>answers[i]===true||answers[i]===false), [answers, lesson]);
  const setAns=(i,v)=> setAnswers(p=>({...p,[i]:v}));
  const finish=()=>{
    if(lesson.practice){
      const total = Object.keys(answers).length || 0;
      const correct = Object.values(answers).filter(v=>v===true).length;
      const pct = total ? Math.round((correct/total)*100) : 0;
      setScorePct(pct);
      if(pct>=70){ setShowCert(true); onPracticeSaved && onPracticeSaved({ trackName: track.name, scorePct: pct, date:new Date().toISOString() }); }
      setComplete(true); try{ localStorage.setItem(key, JSON.stringify({ complete:true, answers })); }catch{}; return;
    }
    if(!complete && allAnswered){ setComplete(true); try{ localStorage.setItem(key, JSON.stringify({ complete:true, answers })); }catch{}; onAward(lesson.xp||10); }
    else if(complete){ onExit(); }
  };
  if(!lesson) return <div className="max-w-3xl mx-auto px-6 py-16"><Card className="p-8"><p>Lesson not found.</p><div className="mt-4"><Button onClick={onExit}>Back</Button></div></Card></div>;
  return <div className="max-w-3xl mx-auto px-6 py-12">
    <CertificateModal open={showCert} onClose={()=>setShowCert(false)} trackName={track.name} scorePct={scorePct} onSave={()=>{}} />
    <div className="mb-6 flex items-start justify-between"><div><p className="text-xs uppercase tracking-wide text-muted">{track.name} • {chapter.title}</p><h2 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h2></div><Badge>{lesson.practice? "Practice": `${lesson.xp||10} XP`}</Badge></div>
    {!lesson.practice && (<Card className="p-8"><div className="prose max-w-none">{(lesson.body||[]).map((p,i)=>(<p key={i} className="text-[15px] leading-7">{p}</p>))}</div>{Array.isArray(lesson.learnMore)&&lesson.learnMore.length>0 && (<div className="mt-4 flex flex-wrap gap-3">{lesson.learnMore.map((l,i)=>(<a key={i} href={l.href} target="_blank" rel="noreferrer" className="link text-sm">{l.label}</a>))}</div>)}</Card>)}
    <Card className="p-6 mt-6"><h3 className="font-semibold mb-3">{lesson.practice? "Practice Questions" : "Quick Check"}</h3>{(lesson.quiz||[{q:"Ready to start?", labels:["Start","Cancel"]}]).map((q,i)=>(<div key={i} className="mb-4"><p className="mb-2">{q.q || q}</p><div className="grid grid-cols-2 gap-2"><Button onClick={()=>setAns(i,true)} variant={answers[i]===true?"primary":"outline"} aria-pressed={answers[i]===true}>{(q.labels&&q.labels[0])||"Yes"}</Button><Button onClick={()=>setAns(i,false)} variant={answers[i]===false?"primary":"outline"} aria-pressed={answers[i]===false}>{(q.labels&&q.labels[1])||"No"}</Button></div></div>))}</Card>
    <div className="mt-6 flex items-center gap-3"><Button onClick={finish} disabled={!lesson.practice && !Object.keys(answers).length}>{lesson.practice? "Submit Quiz" : (complete? "Close" : "Finish Lesson")}</Button><div className="ml-auto"><Button variant="outline" onClick={onExit}>Back to Tracks</Button></div></div>
  </div>;
}

function Progress({ onBack }){
  const s = load()||{}; const xp = s?.game?.xp || 0; const streak = s?.game?.streak || 1;
  const weekly = s?.game?.weekly || { completed:0, target:5 }; const badges = s?.game?.badges || []; const certs = s?.game?.certificates || [];
  return <div className="max-w-5xl mx-auto px-6 py-12">
    <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-extrabold tracking-tight">Progress</h2><Button variant="outline" onClick={onBack}>Back</Button></div>
    <div className="grid md:grid-cols-4 gap-4">
      <Card className="p-6 col-span-2"><p className="text-sm text-muted mb-2">XP</p><div className="text-3xl font-extrabold">{xp}</div></Card>
      <Card className="p-6"><p className="text-sm text-muted mb-2">Streak</p><div className="text-3xl font-extrabold">{streak}d</div></Card>
      <Card className="p-6"><p className="text-sm text-muted mb-2">Weekly</p><div className="text-3xl font-extrabold">{weekly.completed}/{weekly.target}</div></Card>
    </div>
    <Card className="p-6 mt-6"><p className="text-sm text-muted mb-3">Badges</p><div className="flex flex-wrap gap-2">{badges.length===0? <span className="text-sm text-muted">No badges yet</span> : badges.map(b=><Badge key={b}>{b}</Badge>)}</div>
      <div className="mt-6"><p className="text-sm text-muted mb-3">Certificates</p>{certs.length===0? <span className="text-sm text-muted">No certificates yet</span> : (<div className="grid md:grid-cols-2 gap-3">{certs.map((c,idx)=>(<Card key={idx} className="p-4"><div className="flex items-center justify-between"><div><div className="font-semibold">{c.trackName}</div><div className="text-xs text-muted">{new Date(c.date).toLocaleDateString()} • {c.scorePct}%</div></div><Badge>Passed</Badge></div></Card>))}</div>)}</div></Card>
  </div>;
}

export default function App(){
  const [route,setRoute]=useState("home");
  const [lessonRef,setLessonRef]=useState(null);
  const [tracks,setTracks]=useState(()=>buildTracks());
  const { theme, setTheme } = useTheme();
  const { game, awardXp, addCertificate } = useGame();
  useEffect(()=>{ const s=load(); if(!s?.quiz) setRoute("quiz"); },[]);
  return <div className="min-h-screen">
    <Header onNav={(r)=>setRoute(r)} theme={theme} setTheme={setTheme} />
    {route==="quiz" && <Questionnaire questions={QUESTIONS} onFinish={()=>setRoute("home")} />}
    {route==="home" && <Home onContinue={()=>setRoute("tracks")} weekly={game.weekly||{completed:0,target:5}} />}
    {route==="tracks" && <Tracks tracks={tracks} onOpenLesson={(tid,cid,lid)=>{ setLessonRef({tid,cid,lid}); setRoute("lesson"); }} />}
    {route==="lesson" && lessonRef && (<Lesson tracks={tracks} tid={lessonRef.tid} cid={lessonRef.cid} lid={lessonRef.lid} onExit={()=>setRoute("tracks")} onAward={(xp)=>awardXp(xp)} onPracticeSaved={(cert)=>addCertificate(cert)} />)}
    {route==="progress" && <Progress onBack={()=>setRoute("home")} />}
    {route==="account" && (<div className="max-w-3xl mx-auto px-6 py-12"><Card className="p-8"><h2 className="text-2xl font-extrabold tracking-tight mb-3">Account</h2><div className="space-y-3"><div className="flex items-center justify-between"><span>Redo questionnaire</span><Button variant="outline" onClick={()=>{ const s=load()||{}; save({ ...s, quiz:null }); location.reload(); }}>Redo</Button></div><div className="flex items-center justify-between"><span>View progress</span><Button variant="outline" onClick={()=>setRoute("progress")}>Open</Button></div><div className="flex items-center justify-between"><span>Theme</span><Button variant="outline" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?"Switch to Light":"Switch to Dark"}</Button></div></div></Card></div>)}
    <div className="max-w-6xl mx-auto px-6 pb-10"><div className="mt-8 text-xs text-muted">Education only. Not financial advice.</div></div>
  </div>;
}
