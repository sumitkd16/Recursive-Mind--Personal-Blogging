import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import BlogDetail from "./pages/BlogDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminCreate from "./pages/AdminCreate";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./components/Contact";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ScrollToTop component
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-bg flex flex-col">
                <ScrollToTop />
                <Navbar />

                <main className="flex-1">
                    <Routes>
                        {/* Homepage: Hero + Contact */}
                        <Route
                            path="/"
                            element={
                                <>
                                    <Hero />
                                    <Contact />
                                </>
                            }
                        />

                        {/* Other Pages */}
                        <Route path="/blog/:id" element={<BlogDetail />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/admin-create" element={<AdminCreate />} />
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    </Routes>
                </main>

                {/* Footer is shown on all pages */}
                <Footer />

                {/* Toast Notifications */}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'var(--clr-surface)',
                            color: 'var(--clr-neutral-100)',
                            border: '1px solid var(--clr-surface-elevated)',
                        },
                        success: {
                            iconTheme: {
                                primary: 'var(--clr-primary-500)',
                                secondary: 'var(--clr-neutral-100)',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: 'var(--clr-neutral-100)',
                            },
                        },
                    }}
                />
            </div>
        </BrowserRouter>
    );
}

export default App;