import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LOGO_URL =
    "https://customer-assets.emergentagent.com/job_business-hub-912/artifacts/9khjkn3w_Globen%20new%20logo.png";

const NAV = [
    { to: "/", label: "Home", tid: "nav-home" },
    { to: "/about", label: "About", tid: "nav-about" },
    { to: "/services", label: "Services", tid: "nav-services" },
    { to: "/contact", label: "Contact", tid: "nav-contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    return (
        <header
            data-testid="site-navbar"
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
                scrolled
                    ? "backdrop-blur-xl bg-[#0B0E14]/75 border-b border-[#2A2E39]"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
                <Link
                    to="/"
                    data-testid="brand-logo"
                    className="flex items-center gap-3 group -my-2"
                    aria-label="Globen Solutions — Home"
                >
                    <img
                        src={LOGO_URL}
                        alt="Globen Solutions"
                        className="h-20 w-auto object-contain select-none"
                        draggable={false}
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {NAV.map((n) => (
                        <NavLink
                            key={n.to}
                            to={n.to}
                            end={n.to === "/"}
                            data-testid={n.tid}
                            className={({ isActive }) =>
                                `link-underline text-sm uppercase tracking-widest font-medium ${
                                    isActive
                                        ? "text-white active"
                                        : "text-[#8A919E] hover:text-white"
                                }`
                            }
                        >
                            {n.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:block">
                    <Link
                        to="/contact"
                        data-testid="nav-cta-consult"
                        className="btn-sharp inline-flex items-center gap-2 bg-[#00C805] hover:bg-[#00E006] text-black font-semibold text-sm px-5 py-2.5"
                    >
                        Book a Call
                        <span className="text-black/70">→</span>
                    </Link>
                </div>

                <button
                    data-testid="mobile-menu-toggle"
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-white p-2"
                    aria-label="Toggle menu"
                >
                    {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {open && (
                <div
                    data-testid="mobile-menu"
                    className="md:hidden border-t border-[#2A2E39] bg-[#0B0E14]"
                >
                    <div className="px-6 py-6 flex flex-col gap-4">
                        {NAV.map((n) => (
                            <NavLink
                                key={n.to}
                                to={n.to}
                                end={n.to === "/"}
                                data-testid={`${n.tid}-mobile`}
                                className={({ isActive }) =>
                                    `text-base uppercase tracking-widest font-medium ${
                                        isActive
                                            ? "text-white"
                                            : "text-[#8A919E]"
                                    }`
                                }
                            >
                                {n.label}
                            </NavLink>
                        ))}
                        <Link
                            to="/contact"
                            data-testid="nav-cta-consult-mobile"
                            className="btn-sharp mt-2 bg-[#00C805] text-black font-semibold px-5 py-3 text-center"
                        >
                            Book a Call
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
