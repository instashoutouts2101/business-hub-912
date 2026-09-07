import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Send, Loader2, Clock } from "lucide-react";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

        const submit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill in name, email and message.");
            return;
        }
        try {
            setSubmitting(true);
            await window.emailjs.send(
                "service_23qyqtk",
                "template_a101eje",
                {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || "Not provided",
                    subject: form.subject.trim() || "Not provided",
                    message: form.message.trim(),
                },
                "ltFDopj11WBYfU3e0"
            );
            setSent(true);
            toast.success("Message received. We'll be in touch shortly.");
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (err) {
            toast.error("Failed to send. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div data-testid="contact-page">
            {/* Header */}
            <section className="relative border-b border-[#2A2E39] overflow-hidden">
                <div className="absolute inset-0 gs-grid-bg opacity-60" />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-14">
                    <div className="text-xs uppercase tracking-widest text-[#00C805]">
                        Contact · We reply within 1 business day
                    </div>
                    <h1 className="mt-4 font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tighter max-w-4xl">
                        Let&apos;s look at your <span className="text-[#26A69A]">numbers</span>.
                    </h1>
                    <p className="mt-4 text-[#8A919E] max-w-2xl text-base sm:text-lg leading-relaxed">
                        Send a message, or book a paid strategy session from
                        the Services page. Everything starts with a 30-minute
                        conversation.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: info */}
                <aside className="lg:col-span-4 space-y-6" data-testid="contact-info">
                    <div className="border border-[#2A2E39] bg-[#131722] p-6">
                        <div className="text-xs uppercase tracking-widest text-[#8A919E]">
                            Email
                        </div>
                        <a
                            href="mailto:globensolutions@gmail.com"
                            data-testid="contact-email-link"
                            className="mt-3 flex items-center gap-3 text-white hover:text-[#00C805] break-all font-mono-num text-sm"
                        >
                            <Mail className="w-4 h-4 text-[#26A69A]" />
                            globensolutions@gmail.com
                        </a>
                    </div>

                    <div className="border border-[#2A2E39] bg-[#131722] p-6">
                        <div className="text-xs uppercase tracking-widest text-[#8A919E]">
                            Phone (by request)
                        </div>
                        <div
                            className="mt-3 flex items-center gap-3 text-white font-mono-num text-sm"
                            data-testid="contact-phone"
                        >
                            <Phone className="w-4 h-4 text-[#26A69A]" />
                            Book a call → we&apos;ll dial you back
                        </div>
                    </div>

                    <div className="border border-[#2A2E39] bg-[#131722] p-6">
                        <div className="text-xs uppercase tracking-widest text-[#8A919E]">
                            Availability
                        </div>
                        <div className="mt-3 flex items-start gap-3 text-white text-sm">
                            <Clock className="w-4 h-4 text-[#26A69A] mt-0.5" />
                            <div className="font-mono-num space-y-0.5">
                                <div>Mon – Fri · 09:00 → 18:00</div>
                                <div className="text-[#8A919E]">Sat · by appointment</div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-[#2A2E39] bg-[#131722] p-6">
                        <div className="text-xs uppercase tracking-widest text-[#8A919E]">
                            Office
                        </div>
                        <div className="mt-3 flex items-start gap-3 text-white text-sm leading-relaxed">
                            <MapPin className="w-4 h-4 text-[#26A69A] mt-0.5 shrink-0" />
                            <div>
                                536G, Fitzroy Place 3, Sauchiehall Street,
                                <br />
                                Glasgow City Centre, Glasgow, UK
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right: form */}
                <div className="lg:col-span-8">
                    <form
                        onSubmit={submit}
                        data-testid="contact-form"
                        className="border border-[#2A2E39] bg-[#131722] p-6 lg:p-10"
                        noValidate
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field
                                label="Full name"
                                required
                                testId="contact-name"
                                value={form.name}
                                onChange={update("name")}
                                placeholder="Alex Morgan"
                            />
                            <Field
                                label="Email"
                                type="email"
                                required
                                testId="contact-email"
                                value={form.email}
                                onChange={update("email")}
                                placeholder="alex@company.com"
                            />
                            <Field
                                label="Phone (optional)"
                                testId="contact-phone-input"
                                value={form.phone}
                                onChange={update("phone")}
                                placeholder="+1 555 555 5555"
                            />
                            <Field
                                label="Subject (optional)"
                                testId="contact-subject"
                                value={form.subject}
                                onChange={update("subject")}
                                placeholder="Portfolio review"
                            />
                        </div>

                        <div className="mt-5">
                            <label className="text-xs uppercase tracking-widest text-[#8A919E]">
                                Message <span className="text-[#EF5350]">*</span>
                            </label>
                            <textarea
                                data-testid="contact-message"
                                value={form.message}
                                onChange={update("message")}
                                required
                                rows={6}
                                placeholder="Tell us a bit about your goals, situation and what you're looking for…"
                                className="mt-2 w-full bg-[#0B0E14] border border-[#2A2E39] px-4 py-3 text-white placeholder-[#4a5262] focus:outline-none focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A] resize-y font-sans"
                            />
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <p className="text-xs text-[#8A919E]">
                                We reply from{" "}
                                <span className="text-white font-mono-num">
                                    globensolutions@gmail.com
                                </span>
                                .
                            </p>
                            <button
                                type="submit"
                                disabled={submitting}
                                data-testid="contact-submit"
                                className="btn-sharp inline-flex items-center justify-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold px-6 py-3.5 disabled:opacity-60"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {sent && (
                            <div
                                data-testid="contact-success"
                                className="mt-6 border border-[#00C805]/40 bg-[#00C805]/10 text-[#00C805] text-sm px-4 py-3 font-mono-num"
                            >
                                ✓ Message received. A human will read this and reply.
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}

function Field({ label, testId, required, ...rest }) {
    return (
        <div>
            <label className="text-xs uppercase tracking-widest text-[#8A919E]">
                {label} {required && <span className="text-[#EF5350]">*</span>}
            </label>
            <input
                data-testid={testId}
                required={required}
                {...rest}
                className="mt-2 w-full bg-[#0B0E14] border border-[#2A2E39] px-4 py-3 text-white placeholder-[#4a5262] focus:outline-none focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
            />
        </div>
    );
}
