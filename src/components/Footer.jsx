import { Heart } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-900 border-t border-neutral-800 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Recursive Mind
                        </h3>
                        <p className="text-neutral-300 text-sm">
                            A personal blog sharing thoughts and experiences
                        </p>
                    </div>

                    {/* Quick Navigation Links */}
                    <nav className="flex flex-wrap justify-center gap-6 text-sm">
                        <a href="/" className="text-neutral-300 hover:text-green-400 transition-colors duration-200">
                            Home
                        </a>
                        <a href="#latest" className="text-neutral-300 hover:text-green-400 transition-colors duration-200">
                            Latest Posts
                        </a>
                        <a href="/admin-login" className="text-neutral-300 hover:text-green-400 transition-colors duration-200">
                            Admin
                        </a>
                    </nav>

                    {/* Social Links */}
                    <div className="flex items-center gap-5">
                        <a
                            href="https://www.facebook.com/sumit.kumardutta.3701/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-green-400 transition-colors duration-200 text-xl"
                            aria-label="Facebook"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="https://twitter.com/sumitkdutta"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-green-400 transition-colors duration-200 text-xl"
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/sumitkd16"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-green-400 transition-colors duration-200 text-xl"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin />
                        </a>
                        <a
                            href="https://www.instagram.com/sumit.css/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-green-400 transition-colors duration-200 text-xl"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://github.com/sumitkd16"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-green-400 transition-colors duration-200 text-xl"
                            aria-label="GitHub"
                        >
                            <FaGithub />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-8 pt-8 border-t border-neutral-800">
                    <p className="text-neutral-400 text-sm flex items-center justify-center gap-1">
                        Made with <Heart size={14} className="text-red-400" /> © {currentYear} Recursive Mind
                    </p>
                </div>
            </div>
        </footer>
    );
}