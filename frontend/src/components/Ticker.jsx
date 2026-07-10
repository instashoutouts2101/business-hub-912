import Marquee from "react-fast-marquee";

const TICKERS = [
    { s: "AAPL", p: 232.45, c: +1.32 },
    { s: "MSFT", p: 421.9, c: +0.65 },
    { s: "NVDA", p: 138.72, c: +2.41 },
    { s: "TSLA", p: 267.51, c: -1.08 },
    { s: "SPY", p: 585.16, c: +0.32 },
    { s: "BTC", p: 96341.2, c: +1.85 },
    { s: "ETH", p: 3489.7, c: -0.42 },
    { s: "GOLD", p: 2678.4, c: +0.18 },
    { s: "USDJPY", p: 154.83, c: -0.21 },
    { s: "TLT", p: 89.14, c: +0.44 },
    { s: "META", p: 618.02, c: +0.98 },
    { s: "AMZN", p: 224.19, c: +1.11 },
];

export default function Ticker() {
    return (
        <div className="gs-ticker py-2.5 text-[13px] font-mono-num" data-testid="ticker-tape">
            <Marquee gradient={false} speed={40} pauseOnHover>
                {TICKERS.map((t, i) => {
                    const up = t.c >= 0;
                    return (
                        <div
                            key={`${t.s}-${i}`}
                            className="flex items-center gap-3 px-6 whitespace-nowrap"
                            data-testid={`ticker-item-${t.s.toLowerCase()}`}
                        >
                            <span className="text-white/85 font-semibold tracking-wide">
                                {t.s}
                            </span>
                            <span className="text-[#8A919E]">
                                {t.p.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                            <span className={up ? "up" : "down"}>
                                {up ? "▲" : "▼"} {Math.abs(t.c).toFixed(2)}%
                            </span>
                            <span className="text-[#2A2E39]">|</span>
                        </div>
                    );
                })}
            </Marquee>
        </div>
    );
}
