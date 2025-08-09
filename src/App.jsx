import React from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APP_KEY = "finpath:v5";

const QUESTIONS = [
  "Do you keep a monthly budget?",
  "Do you have an emergency fund?",
  "Have you contributed to a TFSA?",
  "Do you know the difference between a TFSA and an RRSP?",
  "Have you bought stocks, ETFs, or mutual funds before?",
  "Do you understand diversification?",
  "Have you filed your own taxes?",
  "Do you understand how credit scores work?",
  "Have you compared MERs/fees between funds?",
  "Do you know what an index fund is?"
];

// Tracks 1–3
const TRACKS = [
  // Track 1 (Foundations) — shortened here for size; your Canvas file holds the same chapter content
  {
    id: "foundations",
    name: "Foundations",
    color: "#16a34a",
    chapters: [
      {
        id: "mindset",
        title: "Money Mindset & Habits",
        lessons: [
          { id: "why-literacy", title: "Why Financial Literacy Matters in Canada", body: ["If you don’t manage your money, your money will manage you.", "Steady 5‑minute lessons compound."], quiz: ["True/False: Money skills help avoid bank fees.", "True/False: Literacy only matters for high earners."], xp: 10, cta: "You’ve unlocked the Money Starter badge!" },
          { id: "goals", title: "Setting Short‑ vs Long‑Term Goals", body: ["Short = 1–3y. Long = 5+y.", "Use numbers & dates."], quiz: ["Which is long‑term: retirement or a trip next year?", "Which account is designed for retirement?"], xp: 10, cta: "Goal Getter!" },
          { id: "needs-wants", title: "Needs vs Wants", body: ["Needs = essential. Wants = nice‑to‑have.", "Try 50/30/20."], quiz: ["Streaming is a need: T/F?", "Groceries belong to what category?"], xp: 10, cta: "Spending Smart!" },
          { id: "pay-yourself", title: "Pay Yourself First", body: ["Automate savings on payday.", "TFSAs are handy for short/medium goals."], quiz: ["Paying yourself first means saving before spending: T/F?", "Why automate savings?"], xp: 10, cta: "Savings Machine!" },
          { id: "habits", title: "Habits Build Wealth", body: ["Consistent habits beat windfalls.", "Start early for compounding."], quiz: ["Steady saving vs windfalls?", "Starting early helps compounding: T/F?"], xp: 15, cta: "Compound Champ!" }
        ]
      },
      {
        id: "budgeting",
        title: "Budgeting Basics",
        lessons: [
          { id: "what-budget", title: "What is a Budget?", body: ["A plan for income and expenses."], quiz: ["A budget only tracks spending: T/F?", "Main purpose?"], xp: 10, cta: "Budget Boss!" },
          { id: "503020", title: "The 50/30/20 Rule", body: ["50% needs / 30% wants / 20% save+debt (starter)."], quiz: ["What % to save?", "Wants should be 50%: T/F?"], xp: 10, cta: "Rule Master!" },
          { id: "tools", title: "Budgeting Tools", body: ["Spreadsheets or apps—use what sticks."], quiz: ["Best tool is the one you use: T/F?", "Name one tool."], xp: 10, cta: "Toolbox Ready!" },
          { id: "tracking", title: "Tracking Without Burnout", body: ["Track weekly; review monthly."], quiz: ["Monthly reviews help: T/F?", "One anti‑burnout tip?"], xp: 10, cta: "Budget Balance!" },
          { id: "adjust", title: "Adjusting Your Budget", body: ["Update as life changes."], quiz: ["Budgets never change: T/F?", "When to update?"], xp: 10, cta: "Flex Finance!" }
        ]
      },
      {
        id: "banking",
        title: "Banking in Canada",
        lessons: [
          { id: "chs", title: "Chequing vs Savings", body: ["Chequing = daily; Savings = interest."], quiz: ["Which is for daily spending?", "Savings pay interest: T/F?"], xp: 10, cta: "Account Aware!" },
          { id: "rates", title: "Interest Rates", body: ["Good high rate on savings; bad high rate on credit."], quiz: ["High card APR good: T/F?", "0.5% vs 4%—which for savings?"], xp: 10, cta: "Rate Ready!" },
          { id: "etransfer", title: "Interac e‑Transfers", body: ["Fast, secure between banks."], quiz: ["Weekdays only: T/F?", "Usually instant?"], xp: 10, cta: "Transfer Pro!" },
          { id: "fees", title: "Avoiding Bank Fees", body: ["Pick right account; avoid out‑of‑network ATMs."], quiz: ["You must pay bank fees: T/F?", "One way to avoid?"], xp: 10, cta: "Fee Fighter!" },
          { id: "online-trad", title: "Online vs Traditional Banks", body: ["Online often higher interest/lower fees."], quiz: ["Online banks never have fees: T/F?", "Who often offers higher rates?"], xp: 10, cta: "Bank Smart!" }
        ]
      }
    ]
  },

  // Track 2 (Core Investing)
  {
    id: "core",
    name: "Core Investing",
    color: "#2563eb",
    chapters: [
      {
        id: "investing-101",
        title: "Investing 101",
        lessons: [
          { id: "why-invest", title: "Why Invest", body: ["Inflation erodes buying power.", "Investing adds growth & compounding."], quiz: ["Compounding grows faster the longer you wait: T/F?", "Does investing eliminate risk?"], xp: 10, cta: "On your way!" },
          { id: "risk-return", title: "Risk & Return", body: ["Higher potential return ↔ higher risk.", "Match risk to time horizon."], quiz: ["More risk always = more return: T/F?", "Time horizon matters: T/F?"], xp: 10, cta: "Risk Aware!" },
          { id: "asset-classes", title: "Asset Classes", body: ["Cash, bonds, stocks, real estate."], quiz: ["Which has highest volatility historically?", "Bonds usually provide income: T/F?"], xp: 10, cta: "Mix Master!" },
          { id: "indexing", title: "Index Funds & ETFs", body: ["Broad diversification, low costs.", "Common core holding for many investors."], quiz: ["Are ETFs active or passive by default?", "MER matters: T/F?"], xp: 10, cta: "Index Initiate!" },
          { id: "accounts", title: "Accounts: TFSA, RRSP, FHSA", body: ["Tax‑advantaged Canadian accounts.", "Use the right wrapper for the goal."], quiz: ["RRSP withdrawals are taxed: T/F?", "FHSA is for first homes: T/F?"], xp: 15, cta: "Account Smart!" }
        ]
      },
      {
        id: "diversification",
        title: "Diversification & Allocation",
        lessons: [
          { id: "why-div", title: "Why Diversify", body: ["Don’t put all eggs in one basket."], quiz: ["Diversification reduces single‑stock risk: T/F?", "Guarantees gains: T/F?"], xp: 10, cta: "Spread Out!" },
          { id: "allocation", title: "Asset Allocation Basics", body: ["Choose a stocks/bonds mix by risk & horizon."], quiz: ["Allocation depends on age/time: T/F?", "100% stocks always best: T/F?"], xp: 10, cta: "Balanced!" },
          { id: "global", title: "Global Diversification", body: ["Canada is small % of world market."], quiz: ["Home bias is a risk: T/F?", "International exposure helps: T/F?"], xp: 10, cta: "Worldly!" },
          { id: "rebal", title: "Rebalancing", body: ["Reset to target weights periodically."], quiz: ["Rebalance sells winners/buys laggards: T/F?", "Quarterly is the only way: T/F?"], xp: 10, cta: "Steady Hands!" },
          { id: "factor", title: "Factor Basics", body: ["Value, size, quality, momentum."], quiz: ["Factors are guaranteed: T/F?", "Do factor funds have higher tracking error?"], xp: 15, cta: "Factor Curious!" }
        ]
      },
      {
        id: "costs-taxes",
        title: "Costs & Taxes",
        lessons: [
          { id: "fees", title: "MERs & Fees", body: ["Costs compound too—keep them low."], quiz: ["A 2% MER is small: T/F?", "Low fee ETFs often win long term: T/F?"], xp: 10, cta: "Fee Sleuth!" },
          { id: "tax-basics", title: "Tax Basics (Canada)", body: ["Interest, dividends, capital gains—taxed differently."], quiz: ["Capital gains get preferential tax in Canada: T/F?", "Account wrapper affects tax: T/F?"], xp: 10, cta: "Tax Aware!" },
          { id: "location", title: "Asset Location", body: ["Place assets in accounts for tax efficiency."], quiz: ["Tax‑inefficient assets may fit RRSP: T/F?", "TFSA shields growth: T/F?"], xp: 10, cta: "Smart Placement!" },
          { id: "withholding", title: "Withholding Taxes", body: ["US dividends may face withholding."], quiz: ["RRSP treaty relief exists: T/F?", "In TFSA, US withholding disappears: T/F?"], xp: 10, cta: "Treaty Savvy!" },
          { id: "recordkeeping", title: "Recordkeeping", body: ["Track contributions, ACB, statements."], quiz: ["ACB matters for taxable accounts: T/F?", "Keep statements: T/F?"], xp: 15, cta: "Organized!" }
        ]
      },
      {
        id: "implementation",
        title: "Implementation",
        lessons: [
          { id: "broker", title: "Choosing a Broker", body: ["Compare fees, tools, registered account support."], quiz: ["Free trades always cheapest: T/F?", "Does platform support TFSA/RRSP?"] , xp: 10, cta: "Platform Ready!" },
          { id: "orders", title: "Order Types", body: ["Market, limit, stop."], quiz: ["A limit order controls price: T/F?", "Market orders guarantee price: T/F?"], xp: 10, cta: "Order Aware!" },
          { id: "automation", title: "Automating Contributions", body: ["PACs reduce friction & timing risk."], quiz: ["PAC = Pre‑Authorized Contribution: T/F?", "Automation helps consistency: T/F?"], xp: 10, cta: "Auto Pilot!" },
          { id: "ips", title: "Investment Policy Statement", body: ["Write rules before emotions hit."], quiz: ["IPS lists target allocation: T/F?", "Helps avoid market timing: T/F?"], xp: 10, cta: "Plan Builder!" },
          { id: "mistakes", title: "Common Mistakes", body: ["Chasing performance, no plan, high fees."], quiz: ["Chasing hot funds is risky: T/F?", "No plan increases mistakes: T/F?"], xp: 15, cta: "Mistake Proof!" }
        ]
      },
      {
        id: "property-income",
        title: "Income & Real Estate",
        lessons: [
          { id: "dividends", title: "Dividend Basics", body: ["Dividends are not guaranteed."], quiz: ["Dividends are guaranteed: T/F?", "Dividend tax credits exist in Canada: T/F?"], xp: 10, cta: "Income Aware!" },
          { id: "bonds", title: "Bonds & GICs", body: ["Coupons vs accrual; duration risk."], quiz: ["Long duration = higher rate sensitivity: T/F?", "GICs are illiquid: T/F?"], xp: 10, cta: "Fixed‑Income Fan!" },
          { id: "reits", title: "REITs", body: ["Real estate exposure via public vehicles."], quiz: ["REITs = direct property ownership: T/F?", "Yield can vary with rates: T/F?"], xp: 10, cta: "Property Lite!" },
          { id: "cashflow", title: "Cash Flow Planning", body: ["Match withdrawals to safe buckets."], quiz: ["Bucket strategy can reduce sequence risk: T/F?", "100% equities is safe for retirees: T/F?"], xp: 10, cta: "Flow Foresight!" },
          { id: "drawdown", title: "Drawdown Basics", body: ["RRSP to RRIF, minimums apply."], quiz: ["RRIF minimums exist: T/F?", "TFSA withdrawals are taxable: T/F?"], xp: 15, cta: "Decumulation Ready!" }
        ]
      }
    ]
  },

  // Track 3 (Advanced Strategies)
  {
    id: "advanced",
    name: "Advanced Strategies",
    color: "#a21caf",
    chapters: [
      {
        id: "derivatives",
        title: "Options & Derivatives",
        lessons: [
          { id: "options-intro", title: "Options 101", body: ["Calls vs puts; rights vs obligations."], quiz: ["Buying a call = right to buy: T/F?", "Options always suitable for beginners: T/F?"], xp: 10, cta: "Derivative Curious!" },
          { id: "covered-call", title: "Covered Calls", body: ["Income strategy with owned shares."], quiz: ["Covered call requires shares: T/F?", "Unlimited downside protection: T/F?"], xp: 10, cta: "Income Strategist!" },
          { id: "protective-put", title: "Protective Puts", body: ["Portfolio insurance trade‑off."], quiz: ["Put acts like insurance: T/F?", "Protection is free: T/F?"], xp: 10, cta: "Hedge Aware!" },
          { id: "spreads", title: "Spreads & Risk Control", body: ["Define risk with spreads."], quiz: ["Spreads cap loss: T/F?", "Spreads remove all risk: T/F?"], xp: 10, cta: "Risk Controller!" },
          { id: "margin", title: "Margin & Leverage", body: ["Leverage amplifies both ways."], quiz: ["Margin increases risk: T/F?", "Interest costs exist: T/F?"], xp: 15, cta: "Handle With Care!" }
        ]
      },
      {
        id: "real-estate",
        title: "Real Estate (Beyond REITs)",
        lessons: [
          { id: "rental", title: "Rental Properties", body: ["Cash flow, cap rates, vacancy."], quiz: ["Cap rate measures return on property: T/F?", "Vacancy affects returns: T/F?"], xp: 10, cta: "Landlord Lite!" },
          { id: "financing", title: "Financing & Mortgages", body: ["Fixed vs variable; stress test."], quiz: ["Stress test applies in Canada: T/F?", "Variable rates always cheaper: T/F?"], xp: 10, cta: "Mortgage Minded!" },
          { id: "expenses", title: "Operating Expenses", body: ["Maintenance, insurance, taxes."], quiz: ["Ignoring expenses boosts real returns: T/F?", "Insurance matters: T/F?"], xp: 10, cta: "Numbers Aware!" },
          { id: "tax", title: "Real Estate Tax", body: ["Capital gains, principal residence rules."], quiz: ["Principal residence exemption exists: T/F?", "RE income is tax‑free: T/F?"], xp: 10, cta: "Tax‑Savvy!" },
          { id: "exit", title: "Exit Strategies", body: ["Sell, refinance, hold."], quiz: ["Refinance can unlock equity: T/F?", "There is one best exit always: T/F?"], xp: 15, cta: "Strategic Seller!" }
        ]
      },
      {
        id: "tax-advanced",
        title: "Advanced Tax Planning",
        lessons: [
          { id: "split", title: "Income Splitting", body: ["Pension splitting, spousal RRSPs."], quiz: ["Spousal RRSPs can shift income: T/F?", "All splitting is allowed: T/F?"], xp: 10, cta: "Split Smart!" },
          { id: "harvest", title: "Capital Gains Harvesting", body: ["Manage ACB; defer/realize strategically."], quiz: ["Superficial loss rules exist: T/F?", "Harvesting always reduces tax: T/F?"], xp: 10, cta: "ACB Aware!" },
          { id: "withholding-adv", title: "Cross‑Border Withholding", body: ["Treaty nuances by account."], quiz: ["RRSP relief for US dividends: T/F?", "TFSA eliminates all withholding: T/F?"], xp: 10, cta: "Cross‑Border Ready!" },
          { id: "corp", title: "In‑Corp Investing", body: ["Integration, passive income grind."], quiz: ["Small business passive income grind exists: T/F?", "Corporate class funds exist: T/F?"], xp: 10, cta: "Owner‑Operator!" },
          { id: "charity", title: "Donations & Planning", body: ["In‑kind gifts, tax credits."], quiz: ["Donating appreciated securities can reduce tax: T/F?", "All donations get same credit: T/F?"], xp: 15, cta: "Give Smart!" }
        ]
      },
      {
        id: "portfolio-ops",
        title: "Portfolio Optimization",
        lessons: [
          { id: "mean-var", title: "Mean‑Variance Basics", body: ["Trade‑off of risk vs return."], quiz: ["Efficient frontier concept: T/F?", "Higher return with zero added risk always possible: T/F?"], xp: 10, cta: "Optimizer!" },
          { id: "rebal-rules", title: "Rebalancing Rules", body: ["Bands vs calendar."], quiz: ["Bands trigger on % drift: T/F?", "Calendar rebal daily: T/F?"], xp: 10, cta: "Rule Maker!" },
          { id: "tilts", title: "Tilts & Tracking Error", body: ["Style tilts add tracking error."], quiz: ["Tracking error = volatility vs index: T/F?", "Tilts guarantee outperformance: T/F?"], xp: 10, cta: "Tilt Tactician!" },
          { id: "risk-parity", title: "Risk Parity Intro", body: ["Balance risk, not dollars."], quiz: ["Risk parity balances weights: T/F?", "Leverage sometimes used: T/F?"], xp: 10, cta: "Parity Curious!" },
          { id: "withdraw", title: "Sustainable Withdrawals", body: ["Safe rates vary; flexibility helps."], quiz: ["4% is a rule, not a law: T/F?", "Flex spending can help: T/F?"], xp: 15, cta: "Longevity Aware!" }
        ]
      },
      {
        id: "behavior",
        title: "Behavioural Finance",
        lessons: [
          { id: "biases", title: "Investor Biases", body: ["Loss aversion, overconfidence."], quiz: ["Losses hurt more than gains: T/F?", "Overconfidence adds turnover: T/F?"], xp: 10, cta: "Bias Buster!" },
          { id: "discipline", title: "Staying the Course", body: ["Pre‑commitment + IPS."], quiz: ["IPS helps discipline: T/F?", "Checking daily reduces anxiety: T/F?"], xp: 10, cta: "Steady Eddy!" },
          { id: "news", title: "News & Noise", body: ["Differentiate signal vs noise."], quiz: ["Reacting to headlines helps returns: T/F?", "Noise can trigger churn: T/F?"], xp: 10, cta: "Signal Seeker!" },
          { id: "heuristics", title: "Heuristics", body: ["Rules of thumb, used wisely."], quiz: ["Heuristics always bad: T/F?", "Rules of thumb can guide: T/F?"], xp: 10, cta: "Smart Shortcuts!" },
          { id: "coach", title: "When to Get Advice", body: ["Complexity, emotions, taxes—get help."], quiz: ["Advice can add discipline: T/F?", "Fees never matter: T/F?"], xp: 15, cta: "Coaching Ready!" }
        ]
      }
    ]
  }
];

function load() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(APP_KEY)) || null; } catch { return null; }
}
function save(state) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(APP_KEY, JSON.stringify(state)); } catch {}
}

function usePersistentSlice(selector, initial) {
  const [slice, setSlice] = useState(() => selector(load()) ?? initial);
  useEffect(() => {
    const current = load() || {};
    save({ ...current, ...slice });
  }, [slice]);
  return [slice, setSlice];
}

// Dates
function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function weekId(date = new Date()) {
  return startOfWeek(date).toISOString().slice(0, 10);
}

// UI atoms
function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full" aria-label="progress">
      <div className="h-2 bg-black rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
function Badge({ children }) {
  return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-black text-white">{children}</span>;
}
function Card({ children }) {
  return <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow p-6">{children}</div>;
}
function Button({ children, onClick, disabled, variant = "primary", className = "" }) {
  const base = "rounded-full px-5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = variant === "primary"
    ? "bg-black text-white hover:opacity-90 focus:ring-black"
    : variant === "outline"
      ? "border border-black text-black hover:bg-black hover:text-white focus:ring-black"
      : "";
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`${base} ${styles} disabled:opacity-40 ${className}`}>
      {children}
    </button>
  );
}
function Confetti({ show, message = "Great job!" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 grid place-items-center pointer-events-none z-50">
          <div className="text-6xl">🎉</div>
          <span className="sr-only" role="status" aria-live="polite">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function Screen({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black" />
          <span className="font-bold">FinPath</span>
        </div>
        <Badge>Education Only</Badge>
      </header>
      <main className="max-w-5xl mx-auto px-4 pb-16">
        {title && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">{title}</h1>
            {subtitle && <p className="text-gray-700">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

// Gamification
function defaultWeekly() {
  return {
    weekId: weekId(),
    target: 5,
    completed: 0,
    tiers: [
      { target: 3, rewardXp: 30, awarded: false },
      { target: 5, rewardXp: 50, awarded: false },
      { target: 7, rewardXp: 100, awarded: false }
    ],
    done: false
  };
}
function useGamification() {
  const [game, setGame] = usePersistentSlice((s) => s?.game, {
    xp: 0, streak: 0, lastActive: null, badges: [], weekly: defaultWeekly()
  });

  useEffect(() => {
    const todayStr = new Date().toDateString();
    const yesterdayStr = new Date(Date.now()-86400000).toDateString();
    if (game.lastActive !== todayStr) {
      const nextStreak = game.lastActive === yesterdayStr ? (game.streak||0)+1 : 1;
      setGame({ ...game, streak: nextStreak, lastActive: todayStr });
    }
  }, []);

  useEffect(() => {
    const currentWeek = weekId();
    if (game.weekly?.weekId !== currentWeek) setGame({ ...game, weekly: defaultWeekly() });
  }, []);

  const awardXp = (amount) => {
    const nextXp = (game.xp||0) + amount;
    const badges = new Set(game.badges||[]);
    if (!badges.has("First Steps")) badges.add("First Steps");
    if ((game.streak||0) >= 3) badges.add("3‑Day Streak");
    if (nextXp >= 100) badges.add("Century XP");
    setGame({ ...game, xp: nextXp, badges: Array.from(badges), lastActive: new Date().toDateString() });
  };

  const setWeeklyTarget = (target) => {
    const w = game.weekly || defaultWeekly();
    const tiers = (w.tiers||[]).map(t => ({...t, awarded:false}));
    setGame({ ...game, weekly: { ...w, target, completed: 0, tiers, done:false } });
  };

  const recordLessonComplete = () => {
    const w = game.weekly || defaultWeekly();
    if (w.done) return;
    const completed = (w.completed||0)+1;
    let tiers = (w.tiers||[]).map(t => {
      if (!t.awarded && completed >= t.target) { awardXp(t.rewardXp); return {...t, awarded:true}; }
      return t;
    });
    const done = completed >= (w.target||5);
    setGame({ ...game, weekly: { ...w, completed, tiers, done } });
  };

  return { game, awardXp, recordLessonComplete, setWeeklyTarget };
}

// Quiz & recommendation
function Quiz({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const done = index >= QUESTIONS.length;
  const score = useMemo(() => answers.filter(Boolean).length, [answers]);

  useEffect(() => {
    const s = load();
    if (s?.quiz) { setIndex(QUESTIONS.length); setAnswers(s.quiz.answers||[]); }
  }, []);
  useEffect(() => {
    const current = load() || {};
    save({ ...current, quiz: { answers, score } });
  }, [answers, score]);

  const handle = (val) => {
    if (done) return;
    const next = [...answers]; next[index] = val; setAnswers(next); setIndex(index+1);
  };

  if (done) return (
    <Card>
      <div className="flex flex-col items-center text-center gap-4">
        <div className="text-6xl">🧭</div>
        <h2 className="text-2xl font-bold">You're set!</h2>
        <p className="text-gray-700">We’ll recommend a starting point based on your answers.</p>
        <Button onClick={() => onFinish(score)}>See Recommendation</Button>
      </div>
    </Card>
  );

  return (
    <Card>
      <div className="mb-6"><ProgressBar value={(index/QUESTIONS.length)*100} /></div>
      <p className="text-gray-700 mb-2">Question {index+1} of {QUESTIONS.length}</p>
      <h2 className="text-2xl font-semibold mb-6">{QUESTIONS[index]}</h2>
      <div className="flex gap-3">
        <Button onClick={() => handle(true)}>Yes</Button>
        <Button variant="outline" onClick={() => handle(false)}>No</Button>
      </div>
    </Card>
  );
}
function recommendTrack(score) {
  if (score <= 3) return TRACKS[0];
  if (score <= 7) return TRACKS[1] || TRACKS[0];
  return TRACKS[2] || TRACKS[1] || TRACKS[0];
}

// Weekly panels
function WeeklyControls({ weekly, onSetTarget }) {
  const targets = [3,5,7];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {targets.map(t => (
        <Button key={t} variant={weekly.target===t? "primary":"outline"} onClick={() => onSetTarget(t)}>
          {t} lessons
        </Button>
      ))}
    </div>
  );
}
function WeeklyPanel({ weekly }) {
  const nextTier = (weekly.tiers||[]).find(t=>!t.awarded);
  const target = nextTier ? nextTier.target : weekly.target;
  const pct = Math.min(100, (weekly.completed/target)*100);
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Weekly Challenge</h3>
        <Badge>{weekly.completed}/{weekly.target}</Badge>
      </div>
      <ProgressBar value={pct} />
      <p className="text-sm text-gray-600 mt-2">Choose a goal below. Hit a tier to earn bonus XP.</p>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {(weekly.tiers||[]).map(t => (<Badge key={t.target}>{t.target} = {t.rewardXp} XP {t.awarded ? "✓": ""}</Badge>))}
      </div>
    </div>
  );
}

// Overview & dashboard
function ProgressOverview({ onOpenLesson, onSetTarget }) {
  const state = load() || {};
  const completedKeys = Object.keys(state).filter(k => k.startsWith(`${APP_KEY}:progress:`));
  const xp = state?.game?.xp || 0;
  const streak = state?.game?.streak || 1;
  const badges = state?.game?.badges || [];
  const weekly = state?.game?.weekly || defaultWeekly();
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Progress Overview</h2>
        <Badge>{xp} XP</Badge>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded-xl p-4"><p className="text-sm text-gray-600">Daily Streak</p><p className="text-2xl font-bold">{streak} days</p></div>
        <div className="border border-gray-200 rounded-xl p-4"><p className="text-sm text-gray-600">Badges</p><p className="text-2xl font-bold">{badges.length}</p></div>
        <div className="border border-gray-200 rounded-xl p-4"><p className="text-sm text-gray-600">Lessons Completed</p><p className="text-2xl font-bold">{completedKeys.length}</p></div>
      </div>
      <WeeklyPanel weekly={weekly} />
      <WeeklyControls weekly={weekly} onSetTarget={onSetTarget} />
      <div className="mt-6 space-y-2">
        {completedKeys.length === 0 && <p className="text-gray-700">No lessons completed yet.</p>}
        {completedKeys.map((key) => {
          const parts = key.split(":");
          const [_, __, ___, tid, cid, lid] = parts;
          const t = TRACKS.find(t=>t.id===tid); const c=t?.chapters.find(c=>c.id===cid); const l=c?.lessons.find(l=>l.id===lid);
          return (
            <button key={key} onClick={() => onOpenLesson(tid, cid, lid)} className="w-full text-left border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
              {t?.name} • {c?.title} — {l?.title}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
function Dashboard({ onOpenLesson, onOpenOverview, weekly, onSetTarget }) {
  const [state, setState] = useState(load() || {});
  useEffect(() => {
    const onStorage = () => setState(load() || {});
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const score = state?.quiz?.score ?? 0;
  const rec = recommendTrack(score);
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Learning Path</h2>
          <p className="text-gray-700">Recommended start: <span style={{ color: rec.color }} className="font-semibold">{rec.name}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onOpenOverview}>Progress</Button>
          <Badge>{state?.game?.xp || 0} XP</Badge>
        </div>
      </div>
      <WeeklyPanel weekly={weekly} />
      <WeeklyControls weekly={weekly} onSetTarget={onSetTarget} />
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {TRACKS.map((t) => (
          <div key={t.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify_between mb-3">
              <h3 className="font-semibold">{t.name}</h3>
              <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
            </div>
            {t.chapters.map((c) => (
              <div key={c.id} className="mb-3">
                <p className="text-sm text-gray-600 mb-2">{c.title}</p>
                <div className="space-y-2">
                  {c.lessons.map((l) => (
                    <button key={l.id} onClick={() => onOpenLesson(t.id, c.id, l.id)} className="w-full text-left border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
                      {l.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

// Lesson
function Lesson({ tid, cid, lid, onExit, onAward, onWeeklyTick }) {
  const track = TRACKS.find(t => t.id === tid);
  const chapter = track?.chapters.find(c => c.id === cid);
  const lesson = chapter?.lessons.find(l => l.id === lid);
  const key = `${APP_KEY}:progress:${tid}:${cid}:${lid}`;
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(key)); if (s?.complete) setComplete(true); if (s?.answers) setAnswers(s.answers); } catch {}
  }, [key]);

  const allAnswered = useMemo(() => (lesson?.quiz || []).every((_, i) => answers[i] === true || answers[i] === false), [answers, lesson]);
  const setAns = (i, val) => setAnswers(prev => ({ ...prev, [i]: val }));

  const finish = () => {
    if (!complete && allAnswered) {
      setComplete(true); setShowConfetti(true); setTimeout(()=>setShowConfetti(false), 1600);
      try { localStorage.setItem(key, JSON.stringify({ complete: true, answers })); } catch {}
      onAward(lesson.xp); onWeeklyTick();
    } else if (complete) { onExit(); }
  };

  if (!lesson) return (
    <Card>
      <p className="text-gray-700">Lesson not found.</p>
      <div className="mt-4"><Button onClick={onExit}>Back</Button></div>
    </Card>
  );

  return (
    <>
      <Confetti show={showConfetti} message="Lesson complete" />
      <Card>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">{track.name} • {chapter.title}</p>
            <h2 className="text-2xl font-bold">{lesson.title}</h2>
          </div>
          <Badge>{lesson.xp} XP</Badge>
        </div>
        <div className="space-y-4 text-gray-900 mb-8">
          {(lesson.body || []).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Quick Check</h3>
          {(lesson.quiz || []).map((q, i) => (
            <div key={`${i}-${q}`} className="mb-4">
              <p className="mb-2">{q}</p>
              <div className="flex gap-2">
                <Button onClick={() => setAns(i, true)} variant={answers[i] === true ? "primary" : "outline"} aria-pressed={answers[i] === true}>Yes</Button>
                <Button onClick={() => setAns(i, false)} variant={answers[i] === false ? "primary" : "outline"} aria-pressed={answers[i] === false}>No</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={finish} disabled={!allAnswered && !complete}>{complete ? "Close" : "Finish Lesson"}</Button>
          {complete && <Badge>Completed</Badge>}
          <div className="ml-auto"><Button variant="outline" onClick={onExit}>Back to Tracks</Button></div>
        </div>
      </Card>
    </>
  );
}

export default function App() {
  const [phase, setPhase] = useState("quiz");
  const [lessonRef, setLessonRef] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const { game, awardXp, recordLessonComplete, setWeeklyTarget } = useGamification();

  useEffect(() => {
    const s = load();
    if (s?.quiz) setPhase("dashboard");
  }, []);

  const handleQuizFinish = () => setPhase("dashboard");
  const openOverview = () => setPhase("overview");

  return (
    <Screen
      title={phase === "quiz" ? "Let’s find your starting point" : phase === "dashboard" ? "Welcome back" : phase === "overview" ? "Your Progress" : undefined}
      subtitle={phase === "quiz" ? "Swipe‑style yes/no. Takes under a minute." : undefined}
    >
      <Confetti show={showCongrats} message="XP earned" />
      {phase === "quiz" && <Quiz onFinish={handleQuizFinish} />}
      {phase === "dashboard" && !lessonRef && (
        <Dashboard
          weekly={game.weekly}
          onSetTarget={(t) => setWeeklyTarget(t)}
          onOpenLesson={(tid, cid, lid) => setLessonRef({ tid, cid, lid })}
          onOpenOverview={openOverview}
        />)
      }
      {phase === "overview" && !lessonRef && (
        <ProgressOverview
          onSetTarget={(t) => setWeeklyTarget(t)}
          onOpenLesson={(tid, cid, lid) => setLessonRef({ tid, cid, lid })}
        />)
      }
      {lessonRef && (
        <Lesson
          tid={lessonRef.tid}
          cid={lessonRef.cid}
          lid={lessonRef.lid}
          onExit={() => setLessonRef(null)}
          onAward={(amount) => { awardXp(amount); setShowCongrats(true); setTimeout(()=>setShowCongrats(false), 1200); }}
          onWeeklyTick={() => recordLessonComplete()}
        />
      )}
      <footer className="max-w-5xl mx-auto px-4 mt-8 text-xs text-gray-500">
        Education only. Not financial advice. Check provincial resources (OSC, AMF, BCSC, etc.).
        <span className="float-right">XP: {game.xp} • Streak: {game.streak} • Badges: {game.badges.length}</span>
      </footer>
    </Screen>
  );
}
