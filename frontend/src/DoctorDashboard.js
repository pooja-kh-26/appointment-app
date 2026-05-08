import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    LogOut,
    CalendarPlus,
    Users,
    Video,
    Clock,
    Phone,
    CheckCircle2,
    CalendarDays,
    Activity
} from "lucide-react";

function DoctorDashboard() {
    const [day, setDay] = useState("");
    const [slots, setSlots] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [allAvailability, setAllAvailability] = useState([]);

    // Toggles for pagination
    const [showAllBookings, setShowAllBookings] = useState(false);
    const [showAllAvailability, setShowAllAvailability] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    // ------------------ SET AVAILABILITY ------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const slotArray = slots
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);

        if (slotArray.length === 0) return alert("Please enter valid slots");

        const invalidFormat = slotArray.some(s => s.toLowerCase().includes("am") || s.toLowerCase().includes("pm"));
        if (invalidFormat) {
            return alert("Please use 24-hour format (e.g. 14:00 instead of 2:00 PM). AM/PM breaks the Google Calendar date parser.");
        }

        setSaving(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/availability/set`, {
                day: day,
                slots: slotArray
            });

            setSuccess(`Availability updated successfully for ${new Date(day + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}!`);
            setDay("");
            setSlots("");

            setTimeout(() => setSuccess(""), 3000);
            fetchAllAvailability();
        } catch (err) {
            setSuccess("Error updating availability");
        } finally {
            setSaving(false);
        }
    };

    // ------------------ FETCH BOOKINGS ------------------
    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/booking/all`);
            // Only keep upcoming bookings
            const upcoming = res.data.bookings.filter(b => b.date >= today);
            setBookings(upcoming);
        } catch (err) {
            console.error("Error fetching bookings", err);
        } finally {
            setLoading(false);
        }
    };

    // ------------------ FETCH AVAILABILITY ------------------
    const fetchAllAvailability = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/availability/all`);
            // Filter out empty slots and past dates
            const data = res.data.filter(d => d.slots && d.slots.length > 0 && d.day >= today);

            // Sort by date ascending
            data.sort((a, b) => new Date(a.day) - new Date(b.day));

            setAllAvailability(data);
        } catch (err) {
            console.error("Error fetching availability", err);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchAllAvailability();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isDoctor");
        window.location.href = "/";
    };

    const displayedBookings = showAllBookings ? bookings : bookings.slice(0, 5);
    const displayedAvailability = showAllAvailability ? allAvailability : allAvailability.slice(0, 5);

    // ------------------ UI ------------------
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#eef2e6] transition-colors duration-300">

            {/* MOBILE TOP NAV */}
            <div className="md:hidden flex items-center justify-between bg-[#3a5a40] text-white p-4 shadow-md sticky top-0 z-50">
                <h1 className="text-lg font-bold flex items-center gap-2">
                    <Activity size={20} /> Sutra Health
                </h1>
                <div className="flex items-center gap-4">
                    <button onClick={handleLogout} className="text-[#d8e2c8] hover:text-white transition p-1">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex flex-col w-64 bg-[#3a5a40] text-white shadow-2xl z-10 sticky top-0 h-screen">
                <div className="p-8">
                    <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
                        <Activity size={28} className="text-[#ccd5ae]" />                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button className="block w-full text-left px-4 py-3 bg-white/10 text-white rounded-xl font-medium shadow-sm border border-white/5 transition cursor-pointer">
                        Dashboard
                    </button>
                </nav>

                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 text-white font-medium rounded-xl bg-[#588157] hover:bg-[#588157]/90 flex items-center justify-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[#344e41] tracking-tight">
                            Welcome, Doctor
                        </h2>
                        <p className="text-[#6b705c] mt-1">
                            Here is what your schedule looks like today.
                        </p>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="card !p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-[#d8e2c8] text-[#588157] rounded-2xl">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#588157]">Total Upcoming</p>
                            <p className="text-2xl font-bold text-[#344e41]">{bookings.length}</p>
                        </div>
                    </div>

                    <div className="card !p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-2xl">
                            <CalendarPlus size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#588157]">Today's Appointments</p>
                            <p className="text-2xl font-bold text-[#344e41]">
                                {bookings.filter((b) => b.date === today).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* BOOKINGS LIST */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#344e41] flex items-center gap-2">
                                <Users size={20} className="text-[#588157]" /> Upcoming Appointments
                            </h3>
                        </div>

                        {loading ? (
                            <div className="card text-center py-12 animate-pulse">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto mb-4"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="card text-center py-16 border-dashed border-2 border-[#d8e2c8]">
                                <CalendarDays size={40} className="mx-auto text-[#a3b18a] mb-4" />
                                <p className="text-[#588157] font-medium">No upcoming appointments</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {displayedBookings.map((b, i) => (
                                    <div
                                        key={i}
                                        className="card !p-6 hover:shadow-lg hover:border-[#ccd5ae] transition-all duration-300 group"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex gap-4 items-start">
                                                <div className="w-12 h-12 rounded-full bg-[#d8e2c8] dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-[#3a5a40] dark:text-indigo-300 font-bold text-lg shrink-0">
                                                    {b.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#344e41] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {b.name}
                                                    </h4>
                                                    <p className="text-sm text-[#6b705c] dark:text-[#7a8b76] mt-1">
                                                        {b.age} yrs • {b.gender}
                                                    </p>
                                                    <p className="text-sm font-medium text-[#4f5d4f] flex items-center gap-1.5 mt-2">
                                                        <Phone size={14} className="text-[#7a8b76]" /> {b.phone}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="sm:text-right flex flex-col justify-between sm:items-end bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-0 sm:bg-transparent rounded-xl">
                                                <div className="inline-flex items-center gap-1.5 text-sm font-semibold bg-[#eef3e6] text-[#3a5a40] px-3 py-1.5 rounded-lg border border-[#d8e2c8] shadow-sm">
                                                    <Clock size={14} /> {b.date === today ? "Today" : b.date} at {b.time}
                                                </div>

                                                {b.meetLink && (
                                                    <a
                                                        href={b.meetLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-3 sm:mt-auto inline-flex items-center justify-center gap-2 text-s bg-[#588157] text-white px-4 py-2 rounded-xl hover:bg-[#3a5a40] transition shadow-md hover:shadow-lg w-full sm:w-auto"
                                                    >
                                                        <Video size={16} /> Join Meeting
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {bookings.length > 5 && (
                                    <button
                                        onClick={() => setShowAllBookings(!showAllBookings)}
                                        className="w-full py-3 mt-2 text-sm font-bold text-[#588157] bg-[#eef3e6] hover:bg-[#d8e2c8] rounded-xl transition-colors"
                                    >
                                        {showAllBookings ? "Show Less" : `View All ${bookings.length} Appointments`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: FORMS & AVAILABILITY */}
                    <div className="space-y-8">
                        {/* AVAILABILITY FORM */}
                        <div className="card space-y-6 border-t-4 border-t-[#588157]">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <CalendarPlus size={20} className="text-[#588157]" />
                                Add Availability
                            </h3>

                            {success && (
                                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-green-700 dark:text-green-400 font-medium leading-snug">{success}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-[#6b705c] dark:text-[#7a8b76] mb-1.5 uppercase tracking-wider">Select Date</label>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b76] z-10 pointer-events-none" size={18} />
                                        <DatePicker
                                            required
                                            placeholderText="Choose date"
                                            selected={day ? new Date(day + "T12:00:00") : null}
                                            onChange={(date) => {
                                                if (!date) return;
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const dayStr = String(date.getDate()).padStart(2, '0');
                                                const formatted = `${year} - ${month} - ${dayStr}`;
                                                setDay(formatted);
                                            }}
                                            minDate={new Date()}
                                            className="input-field w-full !pl-10 !py-3 rounded-xl" />
                                    </div>
                                    {day && (
                                        <p className="text-xs text-[#588157] mt-2 font-medium">
                                            Updating for: {new Date(day + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#6b705c] dark:text-[#7a8b76] mb-1.5 uppercase tracking-wider">Time Slots</label>
                                    <textarea
                                        rows="3"
                                        value={slots}
                                        onChange={(e) => setSlots(e.target.value)}
                                        placeholder="e.g. 10:00, 14:30 (Use 24-hour format)"
                                        className="input-field resize-none !rounded-xl !p-4 text-sm"
                                        required
                                    />
                                    <p className="text-xs text-[#7a8b76] dark:text-[#6b705c] mt-2">Comma separated list of available times.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary w-full !py-3 !text-base"
                                >
                                    {saving ? "Saving..." : "Update Availability"}
                                </button>
                            </form>
                        </div>

                        {/* CURRENT AVAILABILITY LIST */}
                        <div className="card space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Clock size={20} className="text-[#588157]" />
                                Upcoming Slots
                            </h3>

                            {allAvailability.length > 0 ? (
                                <div className="space-y-4">
                                    {displayedAvailability.map((item, index) => {
                                        let displayDate = item.day;
                                        const isDate = item.day.includes("-");

                                        if (isDate) {
                                            const dateObj = new Date(item.day + "T12:00:00");
                                            if (!isNaN(dateObj)) {
                                                const formattedDate = dateObj.toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short"
                                                });
                                                const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
                                                displayDate = `${weekday}, ${formattedDate}`;
                                            }
                                        }

                                        return (
                                            <div key={index} className="p-4 border border-[#d8e2c8] rounded-xl bg-[#f8f8f2] hover:border-[#a3b18a] transition-colors">
                                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center justify-between">
                                                    {item.day === today ? <span className="text-[#588157]">Today</span> : displayDate}
                                                    <span className="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-[#4f5d4f] px-2 py-0.5 rounded-full">{item.slots.length} slots</span>
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.slots.map((slot, i) => (
                                                        <span key={i} className="px-3 py-1.5 text-xs font-semibold bg-[#fefae0] border border-[#d8e2c8] text-[#344e41] rounded-lg shadow-sm">
                                                            {slot}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {allAvailability.length > 5 && (
                                        <button
                                            onClick={() => setShowAllAvailability(!showAllAvailability)}
                                            className="w-full py-2.5 mt-2 text-sm font-bold text-[#4f5d4f] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                        >
                                            {showAllAvailability ? "Show Less" : `View All ${allAvailability.length} Days`}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <CalendarDays size={32} className="mx-auto mb-3 text-[#a3b18a]" />
                                    <p className="text-sm text-[#6b705c] font-medium">No upcoming availability</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DoctorDashboard;