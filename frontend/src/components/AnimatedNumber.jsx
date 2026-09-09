import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
    target,
    suffix = "",
    duration = 1500,
    format = false,
}) {
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        const start = performance.now();

                        const step = (now) => {
                            const progress = Math.min((now - start) / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            setValue(Math.round(eased * target));
                            if (progress < 1) requestAnimationFrame(step);
                        };
                        requestAnimationFrame(step);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [target, duration]);

    const displayValue = format ? value.toLocaleString() : value;

    return (
        <span ref={ref}>
            {displayValue}
            {suffix}
        </span>
    );
}
