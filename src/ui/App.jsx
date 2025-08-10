import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const APP_KEY = "finpath:runner:v1";

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

const TRACKS = [
  {
    id:"foundations", name:"Foundations", color:"#16a34a", chapters:[
      { id:"mindset", title:"Money Mindset & Habits", lessons:[
        { id:"why-literacy", title:"Why Financial Literacy Matters in Canada", xp:10,
          body:[
            "Financial literacy is the toolkit for everyday decisions: how you bank, budget, borrow, save, insure, and invest.",
            "In Canada, choices like TFSA vs RRSP or fixed vs variable mortgage have tax‑ and cash‑flow consequences.",
            "Small actions compound: automatic savings, comparing MERs, and reviewing statements can add thousands over time.",
            "Build a habit of learning 5 minutes a day—the way you’d practice a language."
          ],
          learnMore:[
            {label:"FCAC – Financial literacy", href:"https://www.canada.ca/en/financial-consumer-agency.html"},
            {label:"OSC – GetSmarterAboutMoney", href:"https://www.getsmarteraboutmoney.ca/"}
          ],
          quiz:[
            { q:"Learning money skills can help you avoid bank fees.", labels:["True","False"] },
            { q:"Financial literacy only matters if you earn a lot.", labels:["False","True"] }
          ]
        },
        { id:"goals", title:"Setting Short- vs Long-Term Goals", xp:10,
          body:[
            "Short-term goals (1–3 years) include building a buffer or paying off a card. Long-term goals (5+ years) include retirement or a down payment.",
            "Write goals with numbers and dates (e.g., ‘Save $150/month to reach $1,800 by June 30’).",
            "Match the account to the goal: TFSAs are flexible for short/medium goals; RRSPs are designed for retirement savings.",
            "Review quarterly and adjust contributions as income or expenses change."
          ],
          learnMore:[{label:"FCAC – Make a savings plan", href:"https://www.canada.ca/en/financial-consumer-agency/services/savings-investments/make-savings-plan.html"}],
          quiz:[
            { q:"Saving for retirement vs a trip next year: which is long-term?", labels:["Retirement","Trip next year"] },
            { q:"Which account is primarily for retirement savings?", labels:["RRSP","TFSA"] }
          ]
        }
      ]},
      { id:"budgeting", title:"Budgeting Basics", lessons:[
        { id:"what-budget", title:"What is a Budget?", xp:10,
          body:[
            "A budget is a written plan for income and expenses so you can see where money goes before it’s gone.",
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
  {
    id:"investing-basics", name:"Investing Basics", color:"#0ea5e9", chapters:[
      { id:"registered-accounts", title:"Registered Accounts", lessons:[
        { id:"tfsa-intro", title:"TFSA: Tax‑Free Savings Account", xp:15,
          body:[
            "A TFSA lets investments grow tax‑free; withdrawals are also tax‑free.",
            "Contribution room accumulates each year; withdrawals create room next year."
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
      ]}
    ]
  }
];

function load(){ try{ return JSON.parse(localStorage.getItem(APP_KEY))||null; }catch{ return null; } }
function save(s){ try{ localStorage.setItem(APP_KEY, JSON.stringify(s)); }catch{} }
function clsx(...c){ return c.filter(Boolean).join(" "); }
const prefersDark = typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches : false;

function useTheme(){
  const [theme,setTheme]=useState(()=> (load()?.theme) || (prefersDark?"dark":"light"));
  useEffect(()=>{ document.documentElement.setAttribute("data-theme", theme); const s=load()||{}; save({...s, theme}); },[theme]);
  return { theme, setTheme };
}

function Card({children,className,style}){ return <div className={clsx("rounded-2xl shadow-elev", className)} style={{background:"var(--card)", ...style}}>{children}</div>; }
function Button({children,onClick,variant="primary",className,disabled}){
  const base="focus-ring inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold transition";
  const styles={ primary:"bg-[var(--fg)] text-[var(--bg)] hover:opacity-90", outline:"border border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]", ghost:"text-[var(--fg)] hover:bg-[var(--fg)]/10" }[variant];
  return <button disabled={disabled} onClick={onClick} className={clsx(base, styles, className)}>{children}</button>;
}
function Badge({children}){ return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--fg)] text-[var(--bg)]">{children}</span>; }
function ProgressBar({value}){ return <div className="w-full h-1.5 rounded-full" style={{background:"color-mix(in oklab, var(--fg) 10%, transparent)"}}><div className="h-1.5 rounded-full" style={{background:"var(--fg)", width:`${Math.min(100,Math.max(0,value))}%`}}/></div>; }

function Header({onNav, theme, setTheme}){
  const [open, setOpen] = useState(false);
  const navItems = [{k:"home",label:"Home"},{k:"tracks",label:"Tracks"},{k:"progress",label:"Progress"},{k:"account",label:"Account"}];
  return <div className="sticky top-0 z-40" style={{background:"color-mix(in oklab, var(--card) 80%, transparent)", backdropFilter:"saturate(180%) blur(12px)"}}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg" style={{background:"var(--fg)"}}/><span className="font-extrabold tracking-tight text-base sm:text-lg">FinPath</span></div>
      <div className="hidden md:flex items-center gap-2">{navItems.map(({k,label})=>(<Button key={k} variant="ghost" onClick={()=>onNav(k)}>{label}</Button>))}<Button variant="ghost" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?"Light":"Dark"}</Button></div>
      <button className="md:hidden p-2 rounded-lg focus-ring" onClick={()=>setOpen(true)} aria-label="Open menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="16" width="18" height="2" rx="1"/></svg></button>
    </div>
    <AnimatePresence>{open && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="md:hidden fixed inset-0 z-50 bg-black/45" onClick={()=>setOpen(false)}><motion.div initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-20,opacity:0}} transition={{type:"spring",stiffness:420,damping:34}} className="rounded-b-2xl p-3 pb-4" style={{background:"var(--card)"}} onClick={(e)=>e.stopPropagation()}>
      <div className="flex items-center justify-between px-1 py-2"><div className="flex items-center gap-3"><div className="w-7 h-7 rounded-lg" style={{background:"var(--fg)"}}/><span className="font-semibold">FinPath</span></div><button className="p-2 rounded-lg focus-ring" onClick={()=>setOpen(false)} aria-label="Close">✕</button></div>
      <div className="mt-2">{navItems.map(({k,label})=>(<button key={k} onClick={()=>{ onNav(k); setOpen(false); }} className="w-full text-left px-3 py-3 rounded-xl hover:bg-[var(--fg)]/10">{label}</button>))}<div className="px-3 pt-2"><Button variant="outline" onClick={()=>{ setTheme(theme==="dark"?"light":"dark"); setOpen(false); }} className="w-full">{theme==="dark"?"Switch to Light":"Switch to Dark"}</Button></div></div>
    </motion.div></motion.div>)}</AnimatePresence>
  </div>;
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

// Swipe card used in questionnaire (full throw, helper chips consistent)
function SwipeCard({ text, onSwipeLeft, onSwipeRight, leftLabel="No", rightLabel="Yes" }){
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 0, 160], [-10, 0, 10]);
  const yesOpacity = useTransform(x, [60, 140], [0, 1]);
  const noOpacity = useTransform(x, [-60, -140], [0, 1]);
  const threshold = 120; const power = 800;
  const fling = (dir)=>{
    const target = (dir>0 ? window.innerWidth : -window.innerWidth) + 240;
    x.stop(); x.set(target);
    if(dir>0){ onSwipeRight(); } else { onSwipeLeft(); }
    setTimeout(()=> x.set(0), 0);
  };
  return <div className="relative">
    <motion.div style={{ x, rotate }} className="rounded-2xl shadow-elev p-6 sm:p-8" drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.2}
      onDragEnd={(e, info)=>{ const X=info.offset.x, V=info.velocity.x; if(X>threshold||V>power){ fling(1); } else if(X<-threshold||V<-power){ fling(-1);} else { x.set(0);} }}>
      <div className="min-h-[120px] sm:min-h-[140px] flex items-center"><h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{text}</h2></div>
      <motion.div style={{ opacity: yesOpacity }} className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold bg-emerald-500/90 text-white">{rightLabel}</motion.div>
      <motion.div style={{ opacity: noOpacity }} className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold bg-rose-500/90 text-white">{leftLabel}</motion.div>
    </motion.div>
    <div className="absolute inset-y-0 left-0 w-10 grid place-items-center pointer-events-none"><span className="text-[10px] text-muted">{leftLabel}</span></div>
    <div className="absolute inset-y-0 right-0 w-10 grid place-items-center pointer-events-none"><span className="text-[10px] text-muted">{rightLabel}</span></div>
  </div>;
}

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

function Home({ onContinue }){
  return <div className="max-w-6xl mx-auto px-6 py-12">
    <Card className="p-8 flex items-center justify-between gap-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-muted">Tap Continue to pick up exactly where you left off.</p>
        <div className="flex gap-3"><Button onClick={onContinue}>Continue learning</Button><Button variant="outline" onClick={onContinue}>Browse tracks</Button></div>
      </div>
    </Card>
  </div>;
}

function Tracks({ tracks, onEnterTrack }){
  return <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
    {tracks.map(t=>(<Card key={t.id} className="p-6">
      <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">{t.name}</h3><div className="w-2 h-2 rounded-full" style={{background:"var(--fg)"}} /></div>
      {t.chapters.map(c=>(<div key={c.id} className="mb-5"><p className="text-xs uppercase tracking-wide text-muted mb-2">{c.title}</p>{(c.lessons||[]).map(l=>(<div key={l.id} className="text-sm text-muted mb-1">{l.title}</div>))}</div>))}
      <div className="mt-4"><Button onClick={()=>onEnterTrack(t.id)}>Start track</Button></div>
    </Card>))}
  </div>;
}

function RunnerHeader({ title, step, total, onQuit }){
  const pct = Math.round((step/Math.max(1,total))*100);
  return <div className="sticky top-0 z-30" style={{background:"color-mix(in oklab, var(--card) 85%, transparent)", backdropFilter:"saturate(180%) blur(10px)"}}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold truncate">{title}</div>
        <button onClick={onQuit} className="text-sm text-muted hover:opacity-80 focus-ring rounded px-2 py-1">Quit</button>
      </div>
      <div className="mt-2"><ProgressBar value={pct} /></div>
      <div className="mt-1 text-xs text-muted">{step} / {total}</div>
    </div>
  </div>;
}

function TrackRunner({ track, onDone, onQuit, updateResume, awardXp }){
  const lessons = track.chapters.flatMap(c=> c.lessons.map(l=> ({...l, _cid:c.id, _cTitle:c.title})));
  const [idx,setIdx]=useState(()=>{
    const s = load(); const ref = s?.runner?.[track.id]?.index ?? 0;
    return Math.min(Math.max(0, ref), lessons.length-1);
  });
  useEffect(()=>{ const s=load()||{}; save({...s, runner:{ ...(s.runner||{}), [track.id]:{ index: idx } }}); },[idx, track.id]);
  useEffect(()=>{ updateResume && updateResume({ tid: track.id, cid: lessons[idx]._cid, lid: lessons[idx].id }); },[idx, track.id]);
  const current = lessons[idx];
  const total = lessons.length;
  const done = idx >= total;
  if(done) return <div className="max-w-3xl mx-auto px-6 py-16"><Card className="p-8 text-center"><div className="text-6xl mb-2">🏁</div><h3 className="text-xl font-semibold">Track complete</h3><p className="text-muted mb-4">Great run through {track.name}.</p><Button onClick={onDone}>Back to Tracks</Button></Card></div>;
  return <div>
    <RunnerHeader title={`${track.name} • ${current._cTitle}`} step={idx+1} total={total} onQuit={onQuit} />
    <LessonInline lesson={current} onFinish={(earnedXp)=>{ awardXp(earnedXp); if(idx+1<total){ setIdx(idx+1); } else { onDone(); } }} />
  </div>;
}

function LessonInline({ lesson, onFinish }){
  const [answers,setAnswers]=useState({});
  const [complete,setComplete]=useState(false);
  const [show,setShow]=useState(false);
  const total = (lesson.quiz||[]).length;
  const allAnswered = (lesson.quiz||[]).every((_,i)=>answers[i]===0||answers[i]===1);
  const choose=(i,idx)=> setAnswers(p=>({...p,[i]:idx}));
  const finish=()=>{ if(!complete && allAnswered){ setComplete(true); setShow(true); } else { setShow(true); } };
  const correct = (lesson.quiz||[]).reduce((acc,q,i)=> acc + ((answers[i]??-1)===0?1:0), 0);
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <Card className="p-8">
      <div className="mb-1 text-xs uppercase tracking-wide text-muted">{lesson.title}</div>
      <div className="prose max-w-none">{(lesson.body||[]).map((p,i)=>(<p key={i} className="text-[15px] leading-7">{p}</p>))}</div>
      {Array.isArray(lesson.learnMore)&&lesson.learnMore.length>0 && (<div className="mt-4 flex flex-wrap gap-3">{lesson.learnMore.map((l,i)=>(<a key={i} href={l.href} target="_blank" rel="noreferrer" className="link text-sm">{l.label}</a>))}</div>)}
    </Card>
    <Card className="p-6 mt-6">
      <h3 className="font-semibold mb-3">Quick Check</h3>
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
    </Card>
    <div className="mt-6 flex items-center gap-3">
      <Button onClick={finish} disabled={!allAnswered && !complete}>{complete? "View Results" : "Finish Lesson"}</Button>
    </div>
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/40 grid place-items-center">
          <Card className="p-6 max-w-md w-[92vw]">
            <div className="text-center space-y-2">
              <div className="text-5xl">🎉</div>
              <h3 className="text-xl font-semibold">Nice work!</h3>
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
  const { theme, setTheme } = useTheme();
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
    <Header onNav={(r)=>setRoute(r)} theme={theme} setTheme={setTheme} />

    {route==="quiz" && <Questionnaire questions={QUESTIONS} onFinish={()=>setRoute("home")} />}

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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-extrabold tracking-tight">Progress</h2><Button variant="outline" onClick={()=>setRoute("home")}>Back</Button></div>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 col-span-2"><p className="text-sm text-muted mb-2">XP</p><div className="text-3xl font-extrabold">{game.xp||0}</div></Card>
          <Card className="p-6"><p className="text-sm text-muted mb-2">Streak</p><div className="text-3xl font-extrabold">{game.streak||1}d</div></Card>
          <Card className="p-6"><p className="text-sm text-muted mb-2">Last track</p><div className="text-sm">{lastRef? lastRef.tid : "—"}</div></Card>
        </div>
      </div>
    )}

    <div className="max-w-6xl mx-auto px-6 pb-10"><div className="mt-8 text-xs text-muted">Education only. Not financial advice.</div></div>
  </div>;
}
