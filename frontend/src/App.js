import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import PaymentSuccess from "@/pages/PaymentSuccess";

function NotFound() {
    return (
        <div
            data-testid="not-found-page"
            className="max-w-3xl mx-auto px-6 lg:px-10 py-32 text-center"
        >
            <div className="font-mono-num text-xs text-[#8A919E] uppercase tracking-widest">
                Error · 404
            </div>
            <h1 className="mt-4 font-display font-black text-5xl text-white tracking-tighter">
                Off-chart territory.
            </h1>
            <p className="mt-4 text-[#8A919E]">
                The page you tried to open doesn&apos;t exist.
            </p>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/payment/success" element={<PaymentSuccess />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
            <Toaster
                theme="dark"
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#131722",
                        border: "1px solid #2A2E39",
                        color: "#D1D4DC",
                    },
                }}
            />
        </div>
    );
}

export default App;
