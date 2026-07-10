import { Link } from "react-router-dom";
import Ticker from "../components/Ticker";
import AnimatedChartBg from "../components/AnimatedChartBg";
import LeadForm from "../components/LeadForm";
import {
    TrendingUp,
    BarChart3,
    Shield,
    Compass,
    ArrowRight,
    LineChart,
    PieChart,
} from "lucide-react";

const STATS = [
    { k: "80%", v: "Client Success", tid: "stat-success" },
    { k: "2,500+", v: "Advices Given", tid: "stat-advices" },
    { k: "13K", v: "Signals Provided", tid: "stat-signals" },
    { k: "7 yrs", v: "Combined Experience", tid: "stat-exp" },
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
];

export default function Home() {
    return (
        <div data-testid="home-page">
            {/* HERO */}
            <section className="relative overflow-hidden min-h-[720px] lg:min-h-[780px]" data-testid="hero-section">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,#0e2e29_0%,#071b17_55%,#04100e_100%)]" />
                    <AnimatedChartBg />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0B0E14]/85 via-[#0B0E14]/40 to-transparent" />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0B0E14]" />
                    <div className="gs-noise" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-24 lg:pt-36 lg:pb-32">
                    <div className="max-w-4xl animate-fade-up">
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
                </div>

                {/* Ticker under hero */}
                <div className="relative">
                    <Ticker />
                </div>
            </section>

            {/* WHAT WE OFFER — THREE BENEFITS */}
            <section
                data-testid="benefits-section"
                className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32"
            >
                <div className="max-w-4xl">
                    <div className="flex items-center gap-3 text-sm text-[#8A919E]">
                        <span className="text-[#26A69A] text-xl leading-none">✱</span>
                        <span className="tracking-wide">What We Offer</span>
                    </div>
                    <h2 className="mt-8 font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tighter text-white">
                        Discover our <br />
                        main <span className="text-[#26A69A]">three</span> benefits
                    </h2>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
                    {[
                        {
                            n: "1",
                            t: "Tailored Financial Solutions",
                            d: "We design personalized advisory plans built around your goals, risk profile and horizon — no cookie-cutter models, ever.",
                        },
                        {
                            n: "2",
                            t: "24/7 Client Support",
                            d: "Markets don't sleep, and neither does our team. Reach us across time zones for prompt, reliable guidance whenever you need it.",
                        },
                        {
                            n: "3",
                            t: "Exclusive Service Benefits",
                            d: "Get access to research reports, quarterly briefings and priority scheduling that go beyond the standard advisory relationship.",
                        },
                    ].map((b, i) => (
                        <div
                            key={b.n}
                            data-testid={`benefit-${b.n}`}
                            className="animate-fade-up group"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div
                                className="font-display font-black text-[7rem] lg:text-[9rem] leading-none tracking-tighter select-none"
                                style={{
                                    color: "transparent",
                                    WebkitTextStroke: "2px #26A69A",
                                }}
                                aria-hidden="true"
                            >
                                {b.n}
                            </div>
                            <div className="mt-4 h-px w-full bg-[#2A2E39] group-hover:bg-[#26A69A] transition-colors duration-300" />
                            <h3 className="mt-6 font-display font-extrabold text-xl lg:text-2xl text-white tracking-tight">
                                {b.t}
                            </h3>
                            <p className="mt-4 text-sm lg:text-[15px] text-[#8A919E] leading-relaxed">
                                {b.d}
                            </p>
                        </div>
                    ))}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2A2E39] border border-[#2A2E39]">
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
                                d: "We find opportunities under every market section for better execution.",
                                i: Compass,
                            },
                            {
                                n: "02",
                                t: "Blueprint",
                                d: "Tailored made trading plan according to each client's needs.",
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

            {/* LEAD FORM (replaces old CTA) */}
            <LeadForm />
        </div>
    );
}
