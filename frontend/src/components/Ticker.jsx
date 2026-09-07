import { useEffect, useRef } from "react";

export default function Ticker() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current.querySelector("script")) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbols: [
                { proName: "OANDA:XAUUSD", title: "GOLD" },
                { proName: "OANDA:USDJPY", title: "USDJPY" },
                { proName: "BITSTAMP:BTCUSD", title: "BTC" },
                { proName: "OANDA:XAGUSD", title: "SILVER" },
                { proName: "OANDA:GBPUSD", title: "GBPUSD" },
                { proName: "OANDA:EURUSD", title: "EURUSD" },
                { proName: "TVC:USOIL", title: "OIL" },
            ],
            showSymbolLogo: false,
            colorTheme: "dark",
            isTransparent: true,
            displayMode: "adaptive",
            locale: "en",
        });

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container" ref={containerRef}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}
