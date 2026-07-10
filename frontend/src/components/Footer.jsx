import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

const LOGO_URL =
    "https://customer-assets.emergentagent.com/job_business-hub-912/artifacts/9khjkn3w_Globen%20new%20logo.png";

export default function Footer() {
    return (
        <footer
            data-testid="site-footer"
            className="border-t border-[#2A2E39] bg-[#0B0E14] mt-24"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="md:col-span-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 group w-fit"
                        data-testid="footer-brand"
                        aria-label="Globen Solutions — Home"
                    >
                        <img
                            src={LOGO_URL}
                            alt="Globen Solutions"
                            className="h-24 w-auto object-contain select-none -my-4"
                            draggable={false}
                        />
                    </Link>
                    <p className="mt-4 text-sm text-[#8A919E] max-w-md leading-relaxed">
                        Clear insights. Sharp execution. Precision financial
                        services for individuals and businesses — portfolio
                        strategy, tax optimization, and wealth planning
                        grounded in disciplined market analysis.
                    </p>
                </div>

                <div>
                    <div className="text-xs uppercase tracking-widest text-[#8A919E] mb-4">
                        Navigate
                    </div>
                    <ul className="space-y-2 text-sm text-white/90">
                        <li>
                            <Link to="/" className="hover:text-[#00C805]" data-testid="footer-link-home">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/services" className="hover:text-[#00C805]" data-testid="footer-link-services">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-[#00C805]" data-testid="footer-link-contact">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <div className="text-xs uppercase tracking-widest text-[#8A919E] mb-4">
                        Reach us
                    </div>
                    <ul className="space-y-3 text-sm text-white/90">
                        <li className="flex items-start gap-2">
                            <Mail className="w-4 h-4 mt-0.5 text-[#26A69A]" />
                            <a
                                href="mailto:globensloutions@gmail.com"
                                className="hover:text-[#00C805] break-all"
                                data-testid="footer-email"
                            >
                                globensloutions@gmail.com
                            </a>
                        </li>
                        <li className="flex items-start gap-2 text-[#8A919E]">
                            <MapPin className="w-4 h-4 mt-0.5 text-[#26A69A]" />
                            <span>Global — Remote-first</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-[#2A2E39]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-[#8A919E]">
                    <span data-testid="footer-copyright">
                        © {new Date().getFullYear()} Globen Solutions. All rights reserved.
                    </span>
                    <span className="font-mono-num">
                        NASDAQ · NYSE · LSE · TSE · HKEX
                    </span>
                </div>
            </div>
        </footer>
    );
}
