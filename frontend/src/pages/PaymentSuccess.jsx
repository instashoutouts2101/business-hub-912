import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");
    const [status, setStatus] = useState("checking");
    const [data, setData] = useState(null);
    const attemptsRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const poll = async () => {
            try {
                attemptsRef.current += 1;
                const res = await api.get(
                    `/payments/checkout/status/${sessionId}`
                );
                setData(res.data);
                if (res.data.payment_status === "paid") {
                    setStatus("paid");
                    return;
                }
                if (
                    res.data.status === "expired" ||
                    res.data.payment_status === "expired"
                ) {
                    setStatus("expired");
                    return;
                }
                if (attemptsRef.current >= 8) {
                    setStatus("timeout");
                    return;
                }
                timerRef.current = setTimeout(poll, 2000);
            } catch (e) {
                if (attemptsRef.current >= 8) {
                    setStatus("error");
                    return;
                }
                timerRef.current = setTimeout(poll, 2500);
            }
        };
        poll();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [sessionId]);

    return (
        <div
            data-testid="payment-success-page"
            className="max-w-3xl mx-auto px-6 lg:px-10 py-24"
        >
            <div className="border border-[#2A2E39] bg-[#131722] p-10">
                {status === "checking" && (
                    <div data-testid="payment-checking" className="flex items-start gap-4">
                        <Loader2 className="w-6 h-6 text-[#26A69A] animate-spin mt-1" />
                        <div>
                            <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
                                Verifying your payment…
                            </h1>
                            <p className="mt-2 text-sm text-[#8A919E]">
                                This usually takes a few seconds.
                            </p>
                        </div>
                    </div>
                )}

                {status === "paid" && (
                    <div data-testid="payment-paid">
                        <div className="flex items-center gap-3 text-[#00C805]">
                            <CheckCircle2 className="w-8 h-8" />
                            <span className="text-xs uppercase tracking-widest">
                                Payment confirmed
                            </span>
                        </div>
                        <h1 className="mt-5 font-display font-black text-3xl lg:text-4xl text-white tracking-tighter">
                            You&apos;re booked.
                        </h1>
                        {data && (
                            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#2A2E39] pt-6">
                                <div>
                                    <div className="text-xs uppercase tracking-widest text-[#8A919E]">
                                        Amount
                                    </div>
                                    <div className="font-mono-num text-white text-lg mt-1">
                                        ${Number(data.amount_total).toFixed(2)}{" "}
                                        {data.currency?.toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs uppercase tracking-widest text-[#8A919E]">
                                        Session
                                    </div>
                                    <div className="font-mono-num text-white text-xs mt-1 break-all">
                                        {sessionId}
                                    </div>
                                </div>
                            </div>
                        )}
                        <p className="mt-6 text-[#8A919E] text-sm">
                            We&apos;ll email you shortly to schedule the exact
                            time. Please also fill in the contact form if
                            there&apos;s context we should know about.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/contact"
                                data-testid="post-payment-contact"
                                className="btn-sharp inline-flex items-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold px-5 py-3"
                            >
                                Share context
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/"
                                data-testid="post-payment-home"
                                className="btn-sharp inline-flex items-center gap-2 border border-[#2A2E39] hover:border-[#26A69A] px-5 py-3 text-white"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                )}

                {(status === "expired" || status === "timeout" || status === "error") && (
                    <div data-testid="payment-failed">
                        <div className="flex items-center gap-3 text-[#EF5350]">
                            <XCircle className="w-8 h-8" />
                            <span className="text-xs uppercase tracking-widest">
                                {status === "expired"
                                    ? "Session expired"
                                    : status === "timeout"
                                        ? "Verification timed out"
                                        : "Payment error"}
                            </span>
                        </div>
                        <h1 className="mt-5 font-display font-black text-3xl text-white tracking-tighter">
                            We couldn&apos;t confirm the payment.
                        </h1>
                        <p className="mt-4 text-[#8A919E] text-sm">
                            Please try again or reach out via the contact form.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/services"
                                className="btn-sharp inline-flex items-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold px-5 py-3"
                            >
                                Try again
                            </Link>
                            <Link
                                to="/contact"
                                className="btn-sharp inline-flex items-center gap-2 border border-[#2A2E39] hover:border-[#26A69A] px-5 py-3 text-white"
                            >
                                Contact us
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
