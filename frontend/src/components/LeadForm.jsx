import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

export default function LeadForm() {
    const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.whatsapp.trim()) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            setLoading(true);
                        await window.emailjs.send(
                "service_23qyqtk",
                "template_vtr7ctj",
                {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.whatsapp.trim(),
                    subject: "Discovery Call Request",
                    message: "This person requested a discovery call. Please reach out on WhatsApp within one business day.",
                },
                "ltFDopj11WBYfU3e0"
            );
            setDone(true);
            toast.success("Received. We'll be in touch on WhatsApp shortly.");
            setForm({ name: "", email: "", whatsapp: "" });
        } catch (err) {
            toast.error("Submission failed. Please try again.");
                    } finally {
            setLoading(false);
        }
    };
    return (
        <section
            className="max-w-7xl mx-auto px-6 lg:px-10 py-16"
            data-testid="lead-cta-section"
        >
            <div className="relative overflow-hidden border border-[#2A2E39] bg-[#131722] p-8 lg:p-12">
                <div className="absolute inset-0 gs-grid-bg opacity-40" />
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-5">
                        <div className="text-xs uppercase tracking-widest text-[#00C805]">
                            Book a discovery call
                        </div>
                        <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter">
                            Ready to run your money
                            <br />
                            like a <span className="text-[#26A69A]">professional</span> desk?
                        </h2>
                        <p className="mt-5 text-[#8A919E] max-w-md">
                            Drop your details below. A senior advisor will
                            reach out on WhatsApp within one business day to
                            schedule a free 30-minute discovery call.
                        </p>
                    </div>

                    <div className="lg:col-span-7">
                        <form
                            onSubmit={submit}
                            data-testid="lead-form"
                            noValidate
                            className="grid grid-cols-1 gap-4"
                        >
                            <Field
                                label="Full name"
                                testId="lead-name"
                                value={form.name}
                                onChange={update("name")}
                                required
                                placeholder="e.g. Alex Morgan"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    label="Email"
                                    type="email"
                                    testId="lead-email"
                                    value={form.email}
                                    onChange={update("email")}
                                    required
                                    placeholder="alex@company.com"
                                />
                                <Field
                                    label="WhatsApp number"
                                    testId="lead-whatsapp"
                                    value={form.whatsapp}
                                    onChange={update("whatsapp")}
                                    required
                                    placeholder="+1 555 555 5555"
                                    inputMode="tel"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                data-testid="lead-submit"
                                className="btn-sharp mt-2 inline-flex items-center justify-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold px-6 py-3.5 disabled:opacity-60 w-full sm:w-auto"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        Request Discovery Call
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {done && (
                                <div
                                    data-testid="lead-success"
                                    className="flex items-center gap-2 border border-[#00C805]/40 bg-[#00C805]/10 text-[#00C805] text-sm px-4 py-3 font-mono-num"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Received. We&apos;ll be in touch on WhatsApp shortly.
                                </div>
                            )}

                            <p className="text-xs text-[#8A919E] mt-1">
                                By submitting you agree to be contacted at the
                                WhatsApp number above.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
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
