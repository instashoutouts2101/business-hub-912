import { useEffect, useRef } from "react";

/**
 * Animated candlestick trading chart background.
 * Renders on a full-size <canvas>. Pauses on prefers-reduced-motion.
 */
export default function AnimatedChartBg({ className = "" }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        let W = 0;
        let H = 0;
        let DPR = 1;

        const COLORS = {
            green: "#1fe6a8",
            teal: "#12b894",
            yellow: "#ffcc33",
            orange: "#ff9d1f",
            red: "#ff4f4f",
            cyan: "#4dfff0",
            grid: "rgba(120,200,180,0.06)",
        };
        const CANDLE_W = 26;
        const CANDLE_GAP = 16;

        let candles = [];
        let scrollOffset = 0;
        const callouts = [];
        let lastCalloutTime = 0;
        const CALLOUT_INTERVAL = 2600;
        const CANDLE_INTERVAL = 1400;
        const SCROLL_SPEED = (CANDLE_W + CANDLE_GAP) / CANDLE_INTERVAL;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            DPR = Math.min(window.devicePixelRatio || 1, 2);
            W = rect.width;
            H = rect.height;
            canvas.width = Math.max(1, Math.floor(W * DPR));
            canvas.height = Math.max(1, Math.floor(H * DPR));
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };

        const randCandleColor = () => {
            const r = Math.random();
            if (r < 0.32) return COLORS.green;
            if (r < 0.55) return COLORS.teal;
            if (r < 0.78) return COLORS.yellow;
            if (r < 0.92) return COLORS.orange;
            return COLORS.red;
        };

        const makeCandle = (prevClose) => {
            const baseline = H * 0.62;
            const volatility = H * 0.11;
            const open =
                prevClose !== undefined
                    ? prevClose
                    : baseline + (Math.random() - 0.5) * volatility;
            const close = open + (Math.random() - 0.5) * volatility * 1.6;
            const high = Math.max(open, close) + Math.random() * volatility * 0.5;
            const low = Math.min(open, close) - Math.random() * volatility * 0.5;
            return {
                open,
                close,
                high,
                low,
                color: randCandleColor(),
            };
        };

        const initCandles = () => {
            candles = [];
            const count = Math.ceil(W / (CANDLE_W + CANDLE_GAP)) + 4;
            let prev;
            for (let i = 0; i < count; i++) {
                const c = makeCandle(prev);
                prev = c.close;
                candles.push(c);
            }
        };

        const shade = (hex, percent) => {
            const num = parseInt(hex.slice(1), 16);
            let r = (num >> 16) + Math.round(255 * (percent / 100));
            let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
            let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
            r = Math.max(0, Math.min(255, r));
            g = Math.max(0, Math.min(255, g));
            b = Math.max(0, Math.min(255, b));
            return `rgb(${r},${g},${b})`;
        };

        const drawGrid = () => {
            ctx.strokeStyle = COLORS.grid;
            ctx.lineWidth = 1;
            const step = 60;
            for (let x = -(scrollOffset % step); x < W; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }
            for (let y = 0; y < H; y += step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }
        };

        const drawCandles = () => {
            const unit = CANDLE_W + CANDLE_GAP;
            for (let i = 0; i < candles.length; i++) {
                const c = candles[i];
                const x = i * unit - scrollOffset;
                if (x < -CANDLE_W || x > W + CANDLE_W) continue;
                ctx.save();
                ctx.shadowColor = c.color;
                ctx.shadowBlur = 14;
                ctx.strokeStyle = c.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + CANDLE_W / 2, c.high);
                ctx.lineTo(x + CANDLE_W / 2, c.low);
                ctx.stroke();
                const bodyTop = Math.min(c.open, c.close);
                const bodyH = Math.max(Math.abs(c.close - c.open), 4);
                const grad = ctx.createLinearGradient(
                    0,
                    bodyTop,
                    0,
                    bodyTop + bodyH,
                );
                grad.addColorStop(0, c.color);
                grad.addColorStop(1, shade(c.color, -25));
                ctx.fillStyle = grad;
                ctx.fillRect(x, bodyTop, CANDLE_W, bodyH);
                ctx.restore();
            }
        };

        const drawWave = (color, amp, freq, phase, offset, t, glow) => {
            ctx.beginPath();
            for (let x = 0; x <= W; x += 6) {
                const y = offset + Math.sin(x * freq + t + phase) * amp;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = color;
            ctx.shadowBlur = glow;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const spawnCallout = (t) => {
            const pct = (Math.random() * 60 + 40).toFixed(4);
            callouts.push({
                x: W * (0.55 + Math.random() * 0.35),
                y: H * (0.28 + Math.random() * 0.18),
                born: t,
                text: `+${pct}%`,
            });
        };

        const drawCallouts = (t) => {
            ctx.font = '600 18px "JetBrains Mono", monospace';
            ctx.textBaseline = "middle";
            for (let i = callouts.length - 1; i >= 0; i--) {
                const c = callouts[i];
                const age = t - c.born;
                const life = 3200;
                if (age > life) {
                    callouts.splice(i, 1);
                    continue;
                }
                const p = age / life;
                const alpha =
                    p < 0.15 ? p / 0.15 : p > 0.75 ? (1 - p) / 0.25 : 1;
                const rise = p * 40;
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
                ctx.fillStyle = "#ffd166";
                ctx.shadowColor = "#ffd166";
                ctx.shadowBlur = 10;
                ctx.fillText(c.text, c.x, c.y - rise);
                ctx.restore();
            }
        };

        const drawCursorPulse = (t) => {
            const cx = W * 0.72 + Math.sin(t * 0.0006) * 30;
            const cy = H * 0.42 + Math.cos(t * 0.0004) * 24;
            const pulse = 1 + 0.4 * Math.sin(t * 0.004);
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, 8 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 18;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx, cy, 20 * pulse, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255,255,255,0.25)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        };

        const drawStatic = () => {
            ctx.clearRect(0, 0, W, H);
            drawGrid();
            drawCandles();
        };

        let lastFrame = performance.now();
        const frame = (now) => {
            const dt = now - lastFrame;
            lastFrame = now;
            scrollOffset += SCROLL_SPEED * dt;
            const unit = CANDLE_W + CANDLE_GAP;
            while (scrollOffset > unit) {
                scrollOffset -= unit;
                candles.shift();
                const prevClose = candles[candles.length - 1].close;
                candles.push(makeCandle(prevClose));
            }
            if (now - lastCalloutTime > CALLOUT_INTERVAL) {
                lastCalloutTime = now;
                spawnCallout(now);
            }
            ctx.clearRect(0, 0, W, H);
            drawGrid();
            drawCandles();
            const t = now * 0.0012;
            drawWave(COLORS.red, H * 0.09, 0.006, 0, H * 0.28, t * 0.9, 10);
            drawWave(COLORS.orange, H * 0.07, 0.005, 1.4, H * 0.34, t * 1.1, 10);
            drawWave(COLORS.cyan, H * 0.1, 0.0045, 2.6, H * 0.5, t * 0.75, 14);
            drawCallouts(now);
            drawCursorPulse(now);
            rafRef.current = requestAnimationFrame(frame);
        };

        const onResize = () => {
            resize();
            initCandles();
            if (reduced) drawStatic();
        };

        resize();
        initCandles();

        if (reduced) {
            drawStatic();
        } else {
            rafRef.current = requestAnimationFrame(frame);
        }

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            data-testid="animated-chart-bg"
            aria-hidden="true"
            className={`absolute inset-0 block w-full h-full ${className}`}
        />
    );
}
