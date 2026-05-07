import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { CalendarHeart, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import BookingForm from "./BookingForm";
import DoctorDashboard from "./DoctorDashboard";
import Login from "./Login";

function Navigation() {
  const location = useLocation();

  if (location.pathname === "/doctor") return null;

  return (
    <nav className="sticky top-0 z-50 bg-[#fefae0] border-b border-[#d8dcca] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-20">

        {/* LEFT SIDE */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-[#588157] p-3 rounded-2xl text-white shadow-md group-hover:scale-105 transition">
            <CalendarHeart size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#3a5a40] tracking-tight">
              Sutra Health
            </h1>

            <p className="text-sm text-[#6b705c]">
              Smart Appointment Scheduling
            </p>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <Link
          to="/login"
          onClick={() => localStorage.removeItem("isDoctor")}
          className="flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-xl bg-[#588157] text-white hover:bg-[#3a5a40] shadow-md transition"
        >
          <LayoutDashboard size={18} />
          Doctor Dashboard
        </Link>
      </div>
    </nav>
  );
}

function App() {
  const isDoctor = localStorage.getItem("isDoctor") === "true";

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300
        bg-[#eef2e6]">

        <Navigation toggleTheme={toggleTheme} isDark={isDark} />

        {/* Main Content */}
        <main className="flex-grow flex justify-center px-4 py-8">
          <div className="w-full max-w-5xl">
            <Routes>
              <Route path="/" element={<BookingForm />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/doctor"
                element={
                  isDoctor ? <DoctorDashboard /> : <Navigate to="/login" />
                }
              />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800">
          © {new Date().getFullYear()} Sutra Health — Smart Appointment Scheduling
        </footer>
      </div>
    </Router>
  );
}

export default App;