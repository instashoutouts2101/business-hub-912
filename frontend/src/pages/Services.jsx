import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import {
    LineChart,
    PieChart,
    Shield,
    Check,
    Loader2,
    ArrowRight,
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

export default function Services() {
    const [packages, setPackages] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        api.get("/services/packages")
            .then((res) => setPackages(res.data.packages || []))
            .catch(() => toast.error("Failed to load packages"))
            .finally(() => setFetching(false));
    }, []);

    const buy = async (pkgId) => {
        try {
            setLoadingId(pkgId);
            const origin = window.location.origin;
            const res = await api.post("/payments/checkout/session", {
                package_id: pkgId,
                origin_url: origin,
            });
            if (res.data?.url) {
                window.location.href = res.data.url;
            } else {
                toast.error("Could not start checkout");
            }
        } catch (e) {
            const detail =
                e?.response?.data?.detail || e?.message || "Payment error";
            toast.error(String(detail));
        } finally {
            setLoadingId(null);
        }
    };

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

            {/* PRICING / PACKAGES */}
            <section
                data-testid="packages-section"
                className="max-w-7xl mx-auto px-6 lg:px-10 py-16"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-[#00C805]">
                            Get started
                        </div>
                        <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl text-white tracking-tighter">
                            Book a paid session
                        </h2>
                        <p className="mt-3 text-sm text-[#8A919E] max-w-xl">
                            Pick a package that fits and we&apos;ll take it from
                            there. Instant Stripe checkout — no back and forth.
                        </p>
                    </div>
                </div>

                {fetching ? (
                    <div
                        data-testid="packages-loading"
                        className="flex items-center gap-2 text-[#8A919E]"
                    >
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading packages…
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {packages.map((p, i) => {
                            const highlighted = i === 1;
                            return (
                                <div
                                    key={p.id}
                                    data-testid={`package-${p.id}`}
                                    className={`relative flex flex-col p-6 lg:p-7 border ${
                                        highlighted
                                            ? "border-[#00C805] bg-[#131722]"
                                            : "border-[#2A2E39] bg-[#131722]"
                                    } card-hover`}
                                >
                                    {highlighted && (
                                        <span className="absolute -top-3 left-6 px-2 py-1 bg-[#00C805] text-black text-[10px] font-bold uppercase tracking-widest">
                                            Popular
                                        </span>
                                    )}
                                    <div className="text-xs uppercase tracking-widest text-[#8A919E]">
                                        Package · 0{i + 1}
                                    </div>
                                    <h3 className="mt-3 font-display font-extrabold text-xl text-white tracking-tight">
                                        {p.name}
                                    </h3>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="font-mono-num font-bold text-4xl text-white">
                                            ${Number(p.amount).toFixed(0)}
                                        </span>
                                        <span className="text-[#8A919E] text-sm uppercase">
                                            {p.currency}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-sm text-[#8A919E] leading-relaxed flex-1">
                                        {p.description}
                                    </p>
                                    <button
                                        data-testid={`buy-${p.id}`}
                                        disabled={loadingId === p.id}
                                        onClick={() => buy(p.id)}
                                        className={`btn-sharp mt-6 inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold ${
                                            highlighted
                                                ? "bg-[#00C805] hover:bg-[#00E006] text-black"
                                                : "bg-[#26A69A] hover:bg-[#4DB6AC] text-black"
                                        } disabled:opacity-60`}
                                    >
                                        {loadingId === p.id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Redirecting…
                                            </>
                                        ) : (
                                            <>
                                                Book & Pay
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
