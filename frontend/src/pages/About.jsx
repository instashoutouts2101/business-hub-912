import { Link } from "react-router-dom";
import {
    Target,
    Shield,
    Sparkles,
    Compass,
    ArrowRight,
    Quote,
} from "lucide-react";

const VALUES = [
    {
        icon: Target,
        title: "Clarity first",
        text: "Every recommendation is explained in plain language, backed by data you can inspect.",
    },
    {
        icon: Shield,
        title: "Fiduciary always",
        text: "We work for the client — no hidden fees, no product sales, no conflicts of interest.",
    },
    {
        icon: Sparkles,
        title: "Sharp execution",
        text: "Once the plan is set, we move quickly. Markets don't wait, and neither should you.",
    },
    {
        icon: Compass,
        title: "Long-term orientation",
        text: "Great returns compound over decades. We optimise for the horizon that matters.",
    },
]; 
const TEAM = [
    {
        initials: "SC",
        name: "Sarika Chaturvedi",
        role: "Director",
        bio: "Oversees firm-wide strategy and governance, ensuring every mandate meets the same fiduciary standard.",
    },
    {
        initials: "JW",
        name: "Jason Webber",
        role: "Research Head",
        bio: "Nine years specialising in forex, commodity and index markets; leads the desk's technical and macro research.",
    },
    {
        initials: "SH",
        name: "Sarah Harper",
        role: "Operations Head",
        bio: "Runs day-to-day execution, compliance and reporting infrastructure across the firm.",
    },
    {
        initials: "EH",
        name: "Eleanor Hartley",
        role: "Sales Head",
        bio: "Former private-bank relationship director; built Globen's client acquisition and advisory pipeline.",
    },
];

export default function About() {
    return (
        <div data-testid="about-page">
            {/* HEADER */}
            <section className="relative border-b border-[#2A2E39] overflow-hidden">
                <div className="absolute inset-0 gs-grid-bg opacity-60" />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-16">
                    <div className="text-xs uppercase tracking-widest text-[#00C805]">
                        About Us · Clear Insights. Sharp Execution.
                    </div>
                    <h1 className="mt-4 font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tighter max-w-4xl">
                        A financial desk built the way we&apos;d want ours run.
                    </h1>
                    <p className="mt-5 text-[#8A919E] max-w-3xl text-base sm:text-lg leading-relaxed">
                        Globen Solutions is an independent financial services
                        firm based in Glasgow. We help individual investors,
                        founders and business owners turn capital into a
                        compounding engine — through disciplined portfolio
                        strategy, tax-aware planning and around-the-clock
                        market intelligence.
                    </p>
                </div>
            </section>

            {/* STORY */}
            <section
                data-testid="about-story"
                className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
                <div className="lg:col-span-4">
                    <div className="text-xs uppercase tracking-widest text-[#26A69A]">
                        Our story
                    </div>
                    <h2 className="mt-3 font-display font-black text-3xl lg:text-4xl text-white tracking-tighter">
                        From the trading desk <br /> to your doorstep.
                    </h2>
                </div>
                <div className="lg:col-span-8 space-y-5 text-[#D1D4DC] text-base leading-relaxed">
                    <p>
                        Globen Solutions was founded on a simple observation:
                        most retail investors get treated like an afterthought.
                        Fees are opaque, advice is generic, and the tools that
                        professional traders rely on rarely make it to the
                        people who need them most.
                    </p>
                    <p>
                        We built the firm to close that gap. Every portfolio
                        we manage runs on the same rigor as an institutional
                        desk — written policy statements, systematic
                        rebalancing, tax-loss overlays and quarterly
                        performance reviews. But the relationship is personal:
                        one advisor, one line, no call-centre.
                    </p>
                    <p>
                        Whether you&apos;re optimising your first serious
                        portfolio or coordinating a multi-generational
                        balance sheet, we bring the same discipline to the
                        table.
                    </p>
                </div>
            </section>

            {/* NUMBERS */}
            <section
                data-testid="about-stats"
                className="max-w-7xl mx-auto px-6 lg:px-10"
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2E39] border border-[#2A2E39]">
                    {[
                        { k: "80%", v: "Client Success" },
                        { k: "2,500+", v: "Advices Given" },
                        { k: "13K", v: "Signals Provided" },
                        { k: "7 yrs", v: "Combined Experience" },
                    ].map((s) => (
                        <div key={s.v} className="bg-[#0B0E14] p-8">
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
            {/* LEADERSHIP */}
<section
    data-testid="about-leadership"
    className="max-w-7xl mx-auto px-6 lg:px-10 py-24"
>
    <div className="text-xs uppercase tracking-widest text-[#00C805]">
        Leadership
    </div>
    <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter">
        The senior <span className="italic text-[#26A69A]">bench</span>
    </h2>

    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {TEAM.map((m, i) => (
            <div key={m.name} data-testid={`team-${i}`}>
                <div className="border-t border-[#2A2E39]" />
                <div className="w-16 h-16 -mt-8 mb-6 rounded-full border border-[#2A2E39] bg-[#0B0E14] flex items-center justify-center">
                    <span className="font-display italic text-[#26A69A] text-lg">
                        {m.initials}
                    </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                    {m.name}
                </h3>
                <div className="mt-1 text-xs uppercase tracking-widest text-[#8A919E]">
                    {m.role}
                </div>
                <p className="mt-4 text-sm text-[#D1D4DC] leading-relaxed">
                    {m.bio}
                </p>
            </div>
        ))}
    </div>
</section>

            {/* VALUES */}
            <section
                data-testid="about-values"
                className="max-w-7xl mx-auto px-6 lg:px-10 py-24"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-[#00C805]">
                            What we stand for
                        </div>
                        <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter">
                            Four principles.
                            <br /> Zero exceptions.
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2E39] border border-[#2A2E39]">
                    {VALUES.map((v, i) => (
                        <div
                            key={v.title}
                            data-testid={`value-${i}`}
                            className="bg-[#131722] p-8 card-hover"
                        >
                            <v.icon
                                className="w-6 h-6 text-[#26A69A]"
                                strokeWidth={1.8}
                            />
                            <h3 className="mt-5 font-display font-extrabold text-xl text-white tracking-tight">
                                {v.title}
                            </h3>
                            <p className="mt-3 text-sm text-[#8A919E] leading-relaxed">
                                {v.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PULL QUOTE */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
                <div className="border border-[#2A2E39] bg-[#131722] p-10 lg:p-16 relative overflow-hidden">
                    <div className="absolute inset-0 gs-grid-bg opacity-30" />
                    <Quote className="w-10 h-10 text-[#26A69A] relative" />
                    <blockquote className="mt-6 relative font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white leading-snug tracking-tight max-w-4xl">
                        &ldquo;Great investing isn&apos;t about predicting the
                        next big move. It&apos;s about building a system that
                        works whether or not you predict it.&rdquo;
                    </blockquote>
                    <div className="mt-6 text-sm text-[#8A919E] uppercase tracking-widest">
                        — Globen Solutions
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
                <div className="border border-[#2A2E39] bg-[#131722] p-10 lg:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="font-display font-black text-3xl lg:text-4xl text-white tracking-tighter">
                            Ready to talk?
                        </h2>
                        <p className="mt-3 text-[#8A919E] max-w-xl">
                            Send a message or book a paid strategy session.
                            Either way, the conversation starts with your
                            goals — not our fees.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/contact"
                            data-testid="about-cta-contact"
                            className="btn-sharp inline-flex items-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold px-6 py-3.5"
                        >
                            Contact us
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/services"
                            data-testid="about-cta-services"
                            className="btn-sharp inline-flex items-center gap-2 border border-[#2A2E39] hover:border-[#26A69A] px-6 py-3.5 text-white font-semibold"
                        >
                            Explore services
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
