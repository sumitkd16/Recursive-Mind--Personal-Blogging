import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Replace with a strong password

        const ADMIN_PASSWORD = import.meta.env.VITE_FIREBASE_ADMIN_PASSWORD;

        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        if (password === ADMIN_PASSWORD) {
            localStorage.setItem("admin", "true");
            navigate("/admin-dashboard");
            toast.success("Successfully logged in ");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-surface rounded-xl p-8 shadow-glow border border-surface-elevated">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-button p-2 rounded-full">
                            <Lock className="text-neutral-900" size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-100 mb-2">Admin Login</h1>
                    <p className="text-neutral-300">Enter the admin password to access the dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-200 mb-2">
                            Admin Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-elevated border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-button text-neutral-900 font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-900"></div>
                                Authenticating...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-neutral-900 rounded-lg">
                    <p className="text-sm text-neutral-400 text-center">
                        This area is restricted to authorized personnel only.
                        Unauthorized access attempts are prohibited.
                    </p>
                </div>
            </div>
        </div>
    );
}