import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isAdmin = localStorage.getItem("admin");

    const handleLogout = () => {
        localStorage.removeItem("admin");
        window.location.reload();
    };

    return (
        <nav className="bg-neutral-900 border-b border-neutral-800 py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold text-gradient-brand tracking-tight"
                >
                    Recursive Mind
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        to="/"
                        className={`${location.pathname === '/' ? 'text-primary-400' : 'text-neutral-200'} hover:text-primary-400 transition-colors`}
                    >
                        Home
                    </Link>
                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin-dashboard"
                                className={`${location.pathname.startsWith('/admin') ? 'text-primary-400' : 'text-neutral-200'} hover:text-primary-400 transition-colors`}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-neutral-200 hover:text-red-400 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/admin-login"
                            className={`${location.pathname === '/admin-login' ? 'text-primary-400' : 'text-neutral-200'} hover:text-primary-400 transition-colors`}
                        >
                            Admin
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-neutral-200"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-neutral-900 border-b border-neutral-800 py-4 px-6">
                    <div className="flex flex-col space-y-4">
                        <Link
                            to="/"
                            className={`${location.pathname === '/' ? 'text-primary-400' : 'text-neutral-200'} hover:text-primary-400 transition-colors`}
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        {isAdmin ? (
                            <>
                                <Link
                                    to="/admin-dashboard"
                                    className={`${location.pathname.startsWith('/admin') ? 'text-primary-400' : 'text-neutral-200'} hover:text-primary-400 transition-colors`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="text-left text-neutral-200 hover:text-red-400 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/admin-login"
                                className={`${location.pathname === '/admin-login' ? 'text-primary-400' : 'text-neutral-200'} hover:text-primary-400 transition-colors`}
                                onClick={() => setIsOpen(false)}
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}