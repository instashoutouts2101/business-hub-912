import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";

const SYMBOL_MAP = [
    { display: "AAPL", query: "AAPL" },
    { display: "MSFT", query: "MSFT" },
    { display: "NVDA", query: "NVDA" },
    { display: "TSLA", query: "TSLA" },
    { display: "SPY", query: "SPY" },
    { display: "BTC", query: "BTC/USD" },
    { display: "ETH", query: "ETH/USD" },
    { display: "GOLD", query: "XAU/USD" },
    { display: "USDJPY", query: "USD/JPY" },
    { display: "TLT", query: "TLT" },
    { display: "META", query: "META" },
    { display: "AMZN", query: "AMZN" },
];

const API_KEY = "ab41de15b33e4369bc438183856a40a8";

export default function Ticker() {
    const [tickers, setTickers] = useState([]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const symbols = SYMBOL_MAP.map((t) => t.query).join(",");
                const res = await fetch(
                    `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${API_KEY}`
                );
                const data = await res.json();

                const updated = SYMBOL_MAP.map(({ display, query }) => {
                    const info = SYMBOL_MAP.length > 1 ? data[query] : data;
                    if (!info || !info.close) return null;
                    return {
                        s: display,
                        p: parseFloat(info.close),
                        c: parseFloat(info.percent_change),
                    };
                }).filter(Boolean);

                if (updated.length > 0) {
                    setTickers(updated);
                }
            } catch (err) {
                console.error("Failed to fetch ticker prices", err);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    if (tickers.length === 0) return null;

    return (
        <div className="gs-ticker py-2.5 text-[13px] font-mono-num" data-testid="ticker-tape">
            <Marquee gradient={false} speed={40} pauseOnHover>
                {tickers.map((t, i) => {
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
