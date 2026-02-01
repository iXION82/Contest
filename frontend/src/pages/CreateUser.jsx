import { useState } from "react";
import { updateUser } from "../api/user.api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "", email: "", password: "",
        age: "", experience: "",
        skills: "", totalProjects: "", projectLinks: "",
        preferredRoles: "", preferredLocations: "",
        expectedSalary: "", preferredJobTypes: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...form,
            age: Number(form.age),
            experience: Number(form.experience),
            totalProjects: Number(form.totalProjects),
            expectedSalary: Number(form.expectedSalary),
            skills: form.skills.split(",").map(s => s.trim()),
            projectLinks: form.projectLinks.split(",").map(s => s.trim()),
            preferredRoles: form.preferredRoles.split(",").map(s => s.trim()),
            preferredLocations: form.preferredLocations.split(",").map(s => s.trim()),
            preferredJobTypes: form.preferredJobTypes.split(",").map(s => s.trim())
        };

        try {
            const res = await updateUser(payload);
            localStorage.setItem("userId", res.data._id);

            alert("Profile created & saved successfully!");
            navigate("/recommend");
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Error creating user");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500";
    const labelStyle = "block mb-2 text-sm font-medium text-slate-300";

    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-indigo-500/30">
                <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header Section */}
                    <div className="px-8 pt-8 pb-4">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Create Professional Profile</h2>
                        <p className="text-slate-400 mt-2">Fill in your details to get personalized job recommendations.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-indigo-400 font-semibold uppercase tracking-wider text-xs">Personal Information</h3>
                                <div className="h-px bg-slate-800 w-full"></div>
                            </div>

                            <div>
                                <label className={labelStyle}>Full Name</label>
                                <input name="name" placeholder="John Doe" className={inputStyle} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className={labelStyle}>Email</label>
                                <input name="email" type="email" placeholder="john@example.com" className={inputStyle} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className={labelStyle}>Password</label>
                                <input name="password" type="password" placeholder="••••••••" className={inputStyle} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className={labelStyle}>Age</label>
                                <input name="age" type="number" placeholder="25" className={inputStyle} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className={labelStyle}>Experience (Years)</label>
                                <input name="experience" type="number" placeholder="5" className={inputStyle} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Section 2: Professional Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-indigo-400 font-semibold uppercase tracking-wider text-xs">Professional Portfolio</h3>
                                <div className="h-px bg-slate-800 w-full"></div>
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelStyle}>Skills (Comma separated)</label>
                                <input name="skills" placeholder="React, Node.js, Python..." className={inputStyle} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className={labelStyle}>Total Projects</label>
                                <input name="totalProjects" type="number" placeholder="12" className={inputStyle} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={labelStyle}>Project Links (URLs)</label>
                                <input name="projectLinks" placeholder="github.com/profile, portfolio.me" className={inputStyle} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Section 3: Preferences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-indigo-400 font-semibold uppercase tracking-wider text-xs">Career Preferences</h3>
                                <div className="h-px bg-slate-800 w-full"></div>
                            </div>

                            <div>
                                <label className={labelStyle}>Preferred Roles</label>
                                <input name="preferredRoles" placeholder="Frontend Dev, UI Engineer" className={inputStyle} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={labelStyle}>Locations</label>
                                <input name="preferredLocations" placeholder="Remote, New York, London" className={inputStyle} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={labelStyle}>Expected Salary (₹)</label>
                                <input name="expectedSalary" type="number" placeholder="80000" className={inputStyle} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className={labelStyle}>Job Types</label>
                                <input name="preferredJobTypes" placeholder="Full-time, Contract" className={inputStyle} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}