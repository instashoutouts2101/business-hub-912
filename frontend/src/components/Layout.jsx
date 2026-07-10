import Navbar from "./Navbar";
import Footer from "./Footer";
import Ticker from "./Ticker";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#0B0E14] text-[#D1D4DC]">
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <div className="mt-16">
                <Ticker />
            </div>
            <Footer />
        </div>
    );
}
