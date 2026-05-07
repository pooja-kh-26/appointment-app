import { useState } from "react";
import { Lock, Stethoscope, Eye, EyeOff } from "lucide-react";

function Login() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            if (password.trim() === "admin123") {
                localStorage.setItem("isDoctor", "true");
                window.location.href = "/doctor";
            } else {
                setError("Incorrect password. Please try again.");
                setPassword("");
            }
            setLoading(false);
        }, 800); // simulate API delay
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4
      bg-[#f4f1e8]
      dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition">

            <div className={`w-full max-w-sm bg-[#fefae0] dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-300
        ${error ? "animate-shake" : ""}`}>

                {/* HEADER */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                    bg-[#588157]
             text-white shadow-lg mb-4">
                        <Stethoscope size={30} />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Doctor Portal
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Secure access to your dashboard
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* PASSWORD */}
                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">
                            Admin Password
                        </label>

                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                autoFocus
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`input-field pl-10 pr-10 transition-all
                  ${error
                                        ? "border-red-400 focus:ring-green-200"
                                        : "focus:ring-green-200"
                                    }`}
                            />

                            {/* TOGGLE */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#588157]"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs mt-2 ml-1">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 rounded-xl bg-[#588157] text-white font-medium
              hover:bg-[#3a5a40] transition active:scale-95 disabled:opacity-60"
                    >
                        {loading ? "Authenticating..." : "Secure Login"}
                    </button>

                </form>

                {/* FOOTER */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    Protected access • Sutra Health
                </p>
            </div>
        </div>
    );
}

export default Login;