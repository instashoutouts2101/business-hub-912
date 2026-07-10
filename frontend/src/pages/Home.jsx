import { Link } from "react-router-dom";
import Ticker from "../components/Ticker";
import {
    TrendingUp,
    BarChart3,
    Shield,
    Compass,
    ArrowRight,
    LineChart,
    PieChart,
    Landmark,
} from "lucide-react";

const HERO_BG =
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGNoYXJ0fGVufDB8fHx8MTc4MzY3NDMyN3ww&ixlib=rb-4.1.0&q=85";

const STATS = [
    { k: "$142M+", v: "Assets Advised", tid: "stat-aum" },
    { k: "12.4%", v: "10-yr Avg. Return", tid: "stat-return" },
    { k: "230+", v: "Clients Served", tid: "stat-clients" },
    { k: "18 yrs", v: "Combined Experience", tid: "stat-exp" },
];

const SERVICE_PREVIEWS = [
    {
        icon: LineChart,
        title: "Investment Advisory",
        text: "Data-driven strategies built around your risk profile, horizon and life goals.",
        color: "#26A69A",
    },
    {
        icon: PieChart,
        title: "Portfolio Management",
        text: "Active, rules-based portfolios across equities, ETFs, bonds and alternatives.",
        color: "#00C805",
    },
    {
        icon: Shield,
        title: "Wealth Planning",
        text: "Long-term plans covering estate, insurance, retirement and tax optimization.",
        color: "#4DB6AC",
    },
    {
        icon: Landmark,
        title: "Tax Optimization",
        text: "Structure holdings to minimize drag and keep more of what you earn.",
        color: "#26A69A",
    },
];

export default function Home() {
    return (
        <div data-testid="home-page">
            {/* HERO */}
            <section className="relative overflow-hidden" data-testid="hero-section">
                <div className="absolute inset-0">
                    <img
                        src={HERO_BG}
                        alt="Trading chart"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14]/40 via-[#0B0E14]/70 to-[#0B0E14]" />
                    <div className="absolute inset-0 gs-grid-bg opacity-70" />
                    <div className="gs-noise" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-24 lg:pt-36 lg:pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-8 animate-fade-up">
                            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#00C805] border border-[#2A2E39] bg-[#131722]/70 px-3 py-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00C805] animate-pulse" />
                                Markets open · Live advisory
                            </div>
                            <h1 className="mt-6 font-display font-black text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-tighter text-white">
                                Financial strategy,
                                <br />
                                <span className="text-[#26A69A]">engineered</span> like a
                                <br />
                                trading terminal.
                            </h1>
                            <p className="mt-6 text-base sm:text-lg text-[#8A919E] max-w-2xl leading-relaxed">
                                Globen Solutions helps investors and business
                                owners turn capital into a compounding
                                engine — with disciplined portfolios, tax-aware
                                planning and always-on market intelligence.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <Link
                                    to="/services"
                                    data-testid="hero-cta-services"
                                    className="btn-sharp inline-flex items-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold px-6 py-3.5"
                                >
                                    Explore Services
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/contact"
                                    data-testid="hero-cta-contact"
                                    className="btn-sharp inline-flex items-center gap-2 border border-[#2A2E39] hover:border-[#26A69A] bg-[#131722] text-white font-semibold px-6 py-3.5"
                                >
                                    Talk to an advisor
                                </Link>
                            </div>
                        </div>

                        {/* Mini chart card */}
                        <div className="lg:col-span-4 animate-fade-up delay-2">
                            <div className="border border-[#2A2E39] bg-[#131722]/80 backdrop-blur-md p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-[#8A919E]">
                                            Model portfolio
                                        </div>
                                        <div className="mt-1 font-display text-2xl font-extrabold text-white">
                                            GLOBEN-100
                                        </div>
                                    </div>
                                    <span className="font-mono-num text-[#00C805] text-sm">
                                        ▲ 12.42%
                                    </span>
                                </div>

                                {/* SVG sparkline */}
                                <svg viewBox="0 0 300 100" className="w-full mt-6 h-24">
                                    <defs>
                                        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#00C805" stopOpacity="0.5" />
                                            <stop offset="100%" stopColor="#00C805" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0,80 L25,72 L50,74 L75,60 L100,66 L125,50 L150,55 L175,42 L200,48 L225,30 L250,36 L275,22 L300,18 L300,100 L0,100 Z"
                                        fill="url(#spark)"
                                    />
                                    <path
                                        d="M0,80 L25,72 L50,74 L75,60 L100,66 L125,50 L150,55 L175,42 L200,48 L225,30 L250,36 L275,22 L300,18"
                                        fill="none"
                                        stroke="#00C805"
                                        strokeWidth="1.6"
                                    />
                                </svg>

                                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                                    {[
                                        { l: "1M", v: "+2.1%" },
                                        { l: "1Y", v: "+18.4%" },
                                        { l: "5Y", v: "+72.6%" },
                                    ].map((x) => (
                                        <div key={x.l} className="border border-[#2A2E39] p-2">
                                            <div className="text-[10px] uppercase tracking-widest text-[#8A919E]">
                                                {x.l}
                                            </div>
                                            <div className="font-mono-num text-[#00C805] text-sm mt-0.5">
                                                {x.v}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticker under hero */}
                <div className="relative">
                    <Ticker />
                </div>
            </section>

            {/* STATS */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20" data-testid="stats-section">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2E39] border border-[#2A2E39]">
                    {STATS.map((s, i) => (
                        <div
                            key={s.tid}
                            data-testid={s.tid}
                            className="bg-[#0B0E14] p-8 animate-fade-up"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="font-display font-black text-3xl sm:text-4xl text-white font-mono-num tracking-tight">
                                {s.k}
                            </div>
                            <div className="mt-2 text-xs uppercase tracking-widest text-[#8A919E]">
                                {s.v}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SERVICES PREVIEW */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-8" data-testid="services-preview">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-[#00C805]">
                            What we do
                        </div>
                        <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter">
                            Built for investors <br className="hidden sm:block" /> who take
                            capital seriously.
                        </h2>
                    </div>
                    <Link
                        to="/services"
                        data-testid="see-all-services"
                        className="btn-sharp inline-flex items-center gap-2 border border-[#2A2E39] hover:border-[#26A69A] bg-transparent text-white text-sm font-medium px-4 py-2.5 w-fit"
                    >
                        See all services <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2E39] border border-[#2A2E39]">
                    {SERVICE_PREVIEWS.map((s, i) => (
                        <div
                            key={s.title}
                            data-testid={`service-preview-${i}`}
                            className="card-hover bg-[#131722] p-8"
                        >
                            <s.icon
                                className="w-6 h-6"
                                style={{ color: s.color }}
                                strokeWidth={1.8}
                            />
                            <h3 className="mt-5 font-display font-extrabold text-xl text-white tracking-tight">
                                {s.title}
                            </h3>
                            <p className="mt-3 text-sm text-[#8A919E] leading-relaxed">
                                {s.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROCESS */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20" data-testid="process-section">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="text-xs uppercase tracking-widest text-[#00C805]">
                            How we work
                        </div>
                        <h2 className="mt-3 font-display font-black text-3xl lg:text-4xl text-white tracking-tighter">
                            A four-step
                            <br /> operating rhythm.
                        </h2>
                        <p className="mt-4 text-sm text-[#8A919E] leading-relaxed max-w-sm">
                            No black boxes. Every decision is traced, tested and
                            documented — the same way a professional trading
                            desk operates.
                        </p>
                    </div>
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                n: "01",
                                t: "Discovery",
                                d: "We audit goals, holdings, cash flow and tax posture.",
                                i: Compass,
                            },
                            {
                                n: "02",
                                t: "Blueprint",
                                d: "A written plan across allocation, tax, insurance and estate.",
                                i: BarChart3,
                            },
                            {
                                n: "03",
                                t: "Execute",
                                d: "We place trades, open accounts and coordinate paperwork.",
                                i: TrendingUp,
                            },
                            {
                                n: "04",
                                t: "Review",
                                d: "Quarterly check-ins with rebalancing and scenario updates.",
                                i: Shield,
                            },
                        ].map((p, i) => (
                            <div
                                key={p.n}
                                data-testid={`process-step-${p.n}`}
                                className="border border-[#2A2E39] bg-[#131722] p-6 card-hover"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="font-mono-num text-xs text-[#8A919E]">
                                        STEP · {p.n}
                                    </span>
                                    <p.i className="w-5 h-5 text-[#26A69A]" />
                                </div>
                                <div className="mt-4 font-display font-extrabold text-xl text-white">
                                    {p.t}
                                </div>
                                <div className="mt-2 text-sm text-[#8A919E]">
                                    {p.d}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                <div
                    className="relative overflow-hidden border border-[#2A2E39] bg-[#131722] p-10 lg:p-16"
                    data-testid="cta-section"
                >
                    <div className="absolute inset-0 gs-grid-bg opacity-40" />
                    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8">
                            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter">
                                Ready to run your money
                                <br />
                                like a professional desk?
                            </h2>
                            <p className="mt-4 text-[#8A919E] max-w-xl">
                                Book a 30-minute discovery call. We&apos;ll review
                                your positions and outline what a Globen
                                blueprint would look like for you.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex lg:justify-end">
                            <Link
                                to="/contact"
                                data-testid="cta-book-call"
                                className="btn-sharp inline-flex items-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold px-6 py-3.5"
                            >
                                Book Discovery Call
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
