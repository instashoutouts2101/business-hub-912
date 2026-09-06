import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LineChart,
    PieChart,
    Shield,
    Check,
    ArrowRight,
    CandlestickChart,
    Coins,
    BarChart3,
    Loader2,
    Zap,
} from "lucide-react";

const SERVICE_DETAILS = [
    {
        icon: LineChart,
        title: "Investment Advisory",
        text: "Objective, fiduciary advice tailored to your risk profile, horizon and life goals.",
        bullets: [
            "Potential opportunities across all market sections",
            "Risk & horizon calibration",
            "Quarterly written outlook",
        ],
    },
    {
        icon: PieChart,
        title: "Portfolio Management",
        text: "Rules-based, tax-aware portfolios across equities, ETFs, bonds and alternatives.",
        bullets: [
            "Model portfolios across all market sections",
            "Systematic rebalancing",
            "Dedicated portfolio manager",
        ],
    },
    {
        icon: Shield,
        title: "Wealth Planning",
        text: "Long-term plans covering retirement, insurance, estate and legacy.",
        bullets: [
            "Multiple asset allocation",
            "Investment planning",
            "Systematic withdrawal advisory",
        ],
    },
];

const SIGNAL_TYPES = [
    {
        icon: CandlestickChart,
        eyebrow: "01 · Currency majors & crosses",
        title: "Forex Signals",
        text: "Precision entries on major and minor currency pairs — driven by macro flow, session structure and clean technical setups.",
        instruments: ["EUR / USD", "GBP / USD", "USD / JPY", "AUD / USD", "USD / CAD", "GBP / JPY"],
        highlights: [
            "Intraday and swing setups",
            "Entry, SL & TP with rationale",
            "Real-time alerts via WhatsApp",
        ],
    },
    {
        icon: Coins,
        eyebrow: "02 · Commodities futures",
        title: "Comex Signals",
        text: "High-conviction trades across metals and energy — where macro news, inventory data and technical levels converge.",
        instruments: ["Gold (XAU)", "Silver (XAG)", "Copper (HG)", "Crude Oil (CL)", "Natural Gas (NG)", "Platinum"],
        highlights: [
            "Macro-driven bias notes",
            "Inventory & news catalysts",
            "Tiered position sizing guidance",
        ],
    },
    {
        icon: BarChart3,
        eyebrow: "03 · Global equity indices",
        title: "Indices Signals",
        text: "Directional and range calls on the world's most-traded indices — timed around opens, closes and key data releases.",
        instruments: ["US30", "US100 (NAS)", "SPX500", "GER40 (DAX)", "UK100 (FTSE)", "JP225 (Nikkei)"],
        highlights: [
            "Pre-market game plans",
            "Levels for scalping & swings",
            "Session-based risk framework",
        ],
    },
];

const PLAN_IDS = ["signals_starter", "signals_pro", "signals_premium"];

const PLAN_FEATURES = {
    signals_starter: [
        "15–20 signals / week",
        "WhatsApp delivery",
        "Entry · SL · TP included",
        "Community access",
    ],
    signals_pro: [
        "Daily signals — Forex, Comex, Indices",
        "WhatsApp delivery",
        "Session game-plans (LDN + NY opens)",
        "Weekly market briefing",
        "Community + trader Q&A",
    ],
    signals_premium: [
        "All Pro features",
        "Real-time / priority alerts",
        "Monthly 1-on-1 strategy review",
        "Personalised risk plan",
        "Direct line to lead analyst",
    ],
};
const PLAN_DATA = { signals_starter: { id: "signals_starter", name: "Starter", description: "For traders just getting started with signals.", amount: 29, currency: "usd", }, signals_pro: { id: "signals_pro", name: "Pro", description: "Our most popular plan for active traders.", amount: 79, currency: "usd", }, signals_premium: { id: "signals_premium", name: "Premium", description: "Full access with personalized support.", amount: 149, currency: "usd", }, };
export default function Services() {
    const [plans] = useState(PLAN_IDS.map((id) => PLAN_DATA[id])); const [showPlans, setShowPlans] = useState(false); const [preselect, setPreselect] = useState(null); const plansRef = useRef(null); const navigate = useNavigate(); const requestAccess = (planId) => { setShowPlans(true); setPreselect(planId); setTimeout(() => { plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); }; const buy = (planId) => { navigate(`/contact?plan=${planId}`); };
    return (
        <div data-testid="services-page">
            {/* Header */}
            <section className="relative border-b border-[#2A2E39] overflow-hidden">
                <div className="absolute inset-0 gs-grid-bg opacity-60" />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-16">
                    <div className="text-xs uppercase tracking-widest text-[#00C805]">
                        Services · Full stack financial advisory
                    </div>
                    <h1 className="mt-4 font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tighter max-w-4xl">
                        Three focused services.
                        <br />
                        One disciplined system.
                    </h1>
                    <p className="mt-5 text-[#8A919E] max-w-2xl text-base sm:text-lg leading-relaxed">
                        Whether you&apos;re building your first serious
                        portfolio or optimizing a complex balance sheet — we
                        cover the full advisory spectrum.
                    </p>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section
                data-testid="services-grid"
                className="max-w-7xl mx-auto px-6 lg:px-10 py-16"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {SERVICE_DETAILS.map((s, i) => (
                        <div
                            key={s.title}
                            data-testid={`service-card-${i}`}
                            className="card-hover flex flex-col bg-[#131722] border border-[#2A2E39] p-8 lg:p-10 min-h-[420px]"
                        >
                            <div className="flex items-center justify-between">
                                <s.icon
                                    className="w-7 h-7 text-[#26A69A]"
                                    strokeWidth={1.8}
                                />
                                <span className="font-mono-num text-[11px] tracking-widest text-[#8A919E]">
                                    0{i + 1}
                                </span>
                            </div>
                            <h3 className="mt-8 font-display font-extrabold text-2xl lg:text-3xl text-white tracking-tight">
                                {s.title}
                            </h3>
                            <p className="mt-4 text-sm lg:text-[15px] text-[#8A919E] leading-relaxed">
                                {s.text}
                            </p>
                            <ul className="mt-6 space-y-2.5 flex-1">
                                {s.bullets.map((b) => (
                                    <li
                                        key={b}
                                        className="flex items-start gap-2 text-sm text-[#D1D4DC]"
                                    >
                                        <Check className="w-4 h-4 mt-0.5 text-[#00C805] shrink-0" />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRADING SIGNALS SECTION */}
            <section
                data-testid="signals-section"
                className="max-w-7xl mx-auto px-6 lg:px-10 py-20"
            >
                <div className="max-w-4xl mb-12">
                    <div className="text-xs uppercase tracking-widest text-[#00C805]">
                        Trading Signals
                    </div>
                    <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter">
                        Live signals across
                        <br />
                        the markets we <span className="text-[#26A69A]">know best</span>.
                    </h2>
                    <p className="mt-4 text-[#8A919E] max-w-2xl">
                        Every call is delivered with a full trade plan — entry,
                        stop-loss, targets and the reasoning behind it. No
                        black boxes, no hype.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {SIGNAL_TYPES.map((s, i) => (
                        <div
                            key={s.title}
                            data-testid={`signal-card-${i}`}
                            className="card-hover flex flex-col bg-[#131722] border border-[#2A2E39] p-8 lg:p-10 min-h-[520px]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="w-11 h-11 grid place-items-center bg-[#0B0E14] border border-[#26A69A]/40">
                                    <s.icon
                                        className="w-5 h-5 text-[#00C805]"
                                        strokeWidth={1.8}
                                    />
                                </span>
                                <span className="font-mono-num text-[10px] tracking-widest text-[#8A919E] uppercase">
                                    Live
                                </span>
                            </div>
                            <div className="mt-8 font-mono-num text-[11px] tracking-widest text-[#26A69A] uppercase">
                                {s.eyebrow}
                            </div>
                            <h3 className="mt-3 font-display font-extrabold text-2xl lg:text-3xl text-white tracking-tight">
                                {s.title}
                            </h3>
                            <p className="mt-4 text-sm lg:text-[15px] text-[#8A919E] leading-relaxed">
                                {s.text}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-1.5">
                                {s.instruments.map((inst) => (
                                    <span
                                        key={inst}
                                        className="font-mono-num text-[11px] px-2 py-1 border border-[#2A2E39] text-[#D1D4DC] bg-[#0B0E14]"
                                    >
                                        {inst}
                                    </span>
                                ))}
                            </div>

                            <ul className="mt-6 space-y-2.5 flex-1">
                                {s.highlights.map((h) => (
                                    <li
                                        key={h}
                                        className="flex items-start gap-2 text-sm text-[#D1D4DC]"
                                    >
                                        <Check className="w-4 h-4 mt-0.5 text-[#00C805] shrink-0" />
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={() => {
                                    const map = ["signals_starter", "signals_pro", "signals_premium"];
                                    requestAccess(map[i] || "signals_pro");
                                }}
                                data-testid={`signal-cta-${i}`}
                                className="btn-sharp mt-8 inline-flex items-center justify-center gap-2 border border-[#26A69A] hover:bg-[#26A69A] hover:text-black text-[#26A69A] text-sm font-semibold px-4 py-3"
                            >
                                Request access
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border border-[#2A2E39] bg-[#131722] p-8 lg:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-[#00C805]">
                            Not sure which stream fits you?
                        </div>
                        <h3 className="mt-2 font-display font-extrabold text-xl lg:text-2xl text-white tracking-tight">
                            Book a free 30-minute discovery call.
                        </h3>
                        <p className="mt-2 text-sm text-[#8A919E] max-w-xl">
                            We&apos;ll map your trading style, capital and time
                            zone to the signal package that fits best.
                        </p>
                    </div>
                    <Link
                        to="/contact"
                        data-testid="signals-book-call"
                        className="btn-sharp inline-flex items-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold px-6 py-3.5 shrink-0"
                    >
                        Book Discovery Call
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* BUY SIGNALS — PLANS (revealed on Request access) */}
            {showPlans && (
                <section
                    ref={plansRef}
                    data-testid="signal-plans-section"
                    className="max-w-7xl mx-auto px-6 lg:px-10 pb-24"
                >
                    <div className="max-w-4xl mb-12">
                        <div className="text-xs uppercase tracking-widest text-[#00C805]">
                            Buy Signals · Monthly Access
                        </div>
                        <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter">
                            Pick the stream that
                            <br />
                            matches your <span className="text-[#26A69A]">edge</span>.
                        </h2>
                        <p className="mt-4 text-[#8A919E] max-w-2xl">
                            Instant delivery after checkout. Cancel anytime.
                            All plans include a 7-day satisfaction window —
                            not happy, drop us a line for a full refund.
                        </p>
                    </div>

                    {plans.length === 0 ? (
                        <div className="flex items-center gap-2 text-[#8A919E]" data-testid="plans-loading">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading plans…
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {plans.map((p, i) => {
                                const featured = p.id === "signals_pro";
                                const focused = preselect === p.id;
                                return (
                                    <div
                                        key={p.id}
                                        data-testid={`plan-${p.id}`}
                                        className={`relative flex flex-col p-8 lg:p-10 min-h-[520px] card-hover border ${
                                            focused
                                                ? "border-[#00C805] shadow-[0_0_0_2px_rgba(0,200,5,0.25)]"
                                                : featured
                                                    ? "border-[#26A69A]"
                                                    : "border-[#2A2E39]"
                                        } bg-[#131722]`}
                                    >
                                        {featured && (
                                            <span className="absolute -top-3 left-8 px-2 py-1 bg-[#00C805] text-black text-[10px] font-bold uppercase tracking-widest">
                                                Most popular
                                            </span>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <Zap
                                                className="w-6 h-6 text-[#26A69A]"
                                                strokeWidth={1.8}
                                            />
                                            <span className="font-mono-num text-[10px] tracking-widest text-[#8A919E] uppercase">
                                                Plan · 0{i + 1}
                                            </span>
                                        </div>
                                        <h3 className="mt-6 font-display font-extrabold text-2xl text-white tracking-tight">
                                            {p.name}
                                        </h3>
                                        <p className="mt-3 text-sm text-[#8A919E] leading-relaxed">
                                            {p.description}
                                        </p>
                                        <div className="mt-6 flex items-baseline gap-1">
                                            <span className="font-mono-num font-bold text-5xl text-white">
                                                ${Number(p.amount).toFixed(0)}
                                            </span>
                                            <span className="text-[#8A919E] text-sm">
                                                /mo · {p.currency?.toUpperCase()}
                                            </span>
                                        </div>
                                        <ul className="mt-6 space-y-2.5 flex-1">
                                            {(PLAN_FEATURES[p.id] || []).map((f) => (
                                                <li
                                                    key={f}
                                                    className="flex items-start gap-2 text-sm text-[#D1D4DC]"
                                                >
                                                    <Check className="w-4 h-4 mt-0.5 text-[#00C805] shrink-0" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button type="button" data-testid={`buy-plan-${p.id}`} onClick={() => buy(p.id)} className={`btn-sharp mt-8 inline-flex items-center justify-center gap-2 px-4 py-3.5 font-semibold ${ featured ? "bg-[#00C805] hover:bg-[#00E006] text-black" : "bg-[#26A69A] hover:bg-[#4DB6AC] text-black" }`} > Subscribe <ArrowRight className="w-4 h-4" /> </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <p className="mt-8 text-xs text-[#8A919E] font-mono-num">
                        Secure payment · powered by Stripe. Signals are educational only —
                        not financial advice. Trade at your own risk.
                    </p>
                </section>
            )}
        </div>
    );
}
