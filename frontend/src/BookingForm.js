import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    User,
    Phone,
    Mail,
    Clock,
    CalendarDays,
    Activity,
    CheckCircle2
} from "lucide-react";

function BookingForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "",
        age: "",
        date: "",
        time: "",
        countryCode: "+1"
    });

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    // // Fetch blocked dates
    // const fetchDates = async () => {
    //     try {
    //         const res = await axios.get("http://localhost:5000/api/dates");
    //         setBlockedDates(res.data.dates);
    //     } catch (err) {
    //         console.error("Error fetching dates", err);
    //     }
    // };

    // useEffect(() => {
    //     fetchDates();
    // }, []);

    // Fetch slots
    const fetchSlots = async (date) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/slots/${date}`);
            setSlots(res.data.slots);
        } catch (err) {
            console.error("Error fetching slots", err);
            setSlots([]);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit booking
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.time) return;

        if (!form.phone) {
            return alert("Please provide a phone number.");
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                phone: `${form.countryCode} ${form.phone}`
            };

            const res = await axios.post(
                "http://localhost:5000/api/booking/create",
                payload
            );

            setSuccess(true);

            // refresh slots
            fetchSlots(form.date);

            // reset time only
            setForm((prev) => ({ ...prev, time: "" }));
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-5 bg-[#a3b18a] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#d4a373]/30">
                {/* LEFT PANEL */}
                <div className="lg:col-span-2 p-10 text-[#3a5a40] flex flex-col justify-between relative overflow-hidden bg-[#a3b18a]">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 opacity-30 rounded-full blur-3xl"></div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Book your consultation
                        </h2>
                        <p className="text-[#3a5a40] mb-8">
                            Choose a convenient time slot and get expert consultation instantly.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Activity />
                                <div>
                                    <h4 className="font-semibold">Expert Doctors</h4>
                                    <p className="text-sm text-[#3a5a40]">
                                        Top-rated specialists
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Clock />
                                <div>
                                    <h4 className="font-semibold">Flexible Slots</h4>
                                    <p className="text-sm text-[#3a5a40]">
                                        Choose your time
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="lg:col-span-3 p-8 sm:p-12 bg-[#fefae0]">
                    {/* CONDITIONAL RENDER: SUCCESS vs FORM */}
                    {success ? (
                        <div className="text-center p-8 mt-10 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                                Booking confirmed! Your appointment has been successfully booked.
                            </h3>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* INPUTS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                <div className="relative sm:col-span-2">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        name="name"
                                        placeholder="Full Name"
                                        className="input-field pl-10"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex gap-2 sm:col-span-2">
                                    <div className="w-[35%] relative">
                                        <select
                                            name="countryCode"
                                            className="input-field w-full"
                                            value={form.countryCode}
                                            onChange={handleChange}
                                            style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
                                        >
                                            <option value="+1">+1 (US/CA)</option>
                                            <option value="+44">+44 (UK)</option>
                                            <option value="+91">+91 (IN)</option>
                                            <option value="+61">+61 (AU)</option>
                                            <option value="+81">+81 (JP)</option>
                                            <option value="+49">+49 (DE)</option>
                                            <option value="+33">+33 (FR)</option>
                                            <option value="+86">+86 (CN)</option>
                                            <option value="+55">+55 (BR)</option>
                                            <option value="+52">+52 (MX)</option>
                                            <option value="+7">+7 (RU)</option>
                                            <option value="+27">+27 (ZA)</option>
                                            <option value="+82">+82 (KR)</option>
                                            <option value="+39">+39 (IT)</option>
                                            <option value="+34">+34 (ES)</option>
                                            <option value="+31">+31 (NL)</option>
                                            <option value="+41">+41 (CH)</option>
                                            <option value="+46">+46 (SE)</option>
                                            <option value="+65">+65 (SG)</option>
                                            <option value="+971">+971 (AE)</option>
                                            <option value="+966">+966 (SA)</option>
                                            <option value="+20">+20 (EG)</option>
                                            <option value="+234">+234 (NG)</option>
                                            <option value="+254">+254 (KE)</option>
                                            <option value="+54">+54 (AR)</option>
                                            <option value="+57">+57 (CO)</option>
                                        </select>
                                    </div>
                                    <div className="w-[65%] relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="tel"
                                            pattern="^\d{7,15}$"
                                            title="Please enter a valid phone number (digits only)."
                                            name="phone"
                                            placeholder="Phone Number"
                                            className="input-field pl-10 w-full"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="relative sm:col-span-2">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        className="input-field pl-10"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <select
                                    required
                                    name="gender"
                                    className="input-field"
                                    value={form.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>

                                <input
                                    required
                                    name="age"
                                    type="number"
                                    placeholder="Age"
                                    className="input-field"
                                    value={form.age}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-500 font-medium ml-1 mb-1 block">Select Date</label>
                                <div className="relative">
                                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
                                    <DatePicker
                                        className="input-field w-full !pl-10"
                                        placeholderText="Choose date"
                                        selected={form.date ? new Date(form.date + "T12:00:00") : null}
                                        onChange={(date) => {
                                            if (!date) return;

                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const day = String(date.getDate()).padStart(2, '0');

                                            const formatted = `${year}-${month}-${day}`;

                                            setForm({
                                                ...form,
                                                date: formatted,
                                                time: ""
                                            });

                                            fetchSlots(formatted);
                                        }}
                                        minDate={new Date()}
                                    />
                                </div>
                            </div>

                            {/* SLOTS */}
                            <div>
                                <label className="text-sm text-[#3a5a40]">Available Slots</label>

                                {form.date ? (
                                    slots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3 mt-2">
                                            {slots.map((slot, i) => (
                                                <button
                                                    type="button"
                                                    key={i}
                                                    onClick={() =>
                                                        setForm({ ...form, time: slot })
                                                    }
                                                    className={`py-2 rounded-lg border text-sm transition
                          ${form.time === slot
                                                            ? "bg-[#588157] border-[#d4a373] text-white shadow-md scale-105"
                                                            : "hover:border-[#d4a373] text-[#3a5a40]"
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-red-500 text-sm mt-2">
                                            No slots available
                                        </p>
                                    )
                                ) : (
                                    <p className="text-gray-400 text-sm mt-2">
                                        Select a date first
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!form.time || loading}
                                className="w-full h-12 text-white font-medium rounded-xl bg-[#588157] hover:bg-[#588157]/90 shadow-lg transition active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "Booking..." : "Confirm Booking"}
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookingForm;