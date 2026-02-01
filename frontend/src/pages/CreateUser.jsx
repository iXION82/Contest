import { useState } from "react";
import { uploadProfileData } from "../api/user.api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const [form, setForm] = useState({
        name: "", email: "", 
        age: "", experience: "",
        skills: "", totalProjects: "", projectLinks: "",
        preferredRoles: "", preferredLocations: "",
        expectedSalary: "", preferredJobTypes: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("userId", userId);

            
            
            
            Object.keys(form).forEach(key => {
                if (key !== "email" && key !== "password") { 
                    formData.append(key, form[key]);
                }
            });

            
            if (file) {
                formData.append("files", file);
            }

            const res = await uploadProfileData(formData);

            
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                user.isProfileComplete = true;
                
                if (res.data.user) {
                    localStorage.setItem("user", JSON.stringify({ ...user, ...res.data.user }));
                } else {
                    localStorage.setItem("user", JSON.stringify(user));
                }
            }

            alert(res.data.aiSourceUsed
                ? "Profile completed! (Merged manual inputs with AI resume parsing)"
                : "Profile created successfully!");

            navigate("/recommend");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.response?.data?.error || "Error updating profile");
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
                <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up">

                    { }
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    { }
                    <div className="px-8 pt-10 pb-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            🚀 Complete Your Profile
                        </h2>
                        <p className="text-slate-400 mt-2 max-w-2xl">
                            Upload your resume to auto-fill details, or manually enter your information.
                            <span className="text-indigo-400 font-medium block mt-1 text-sm bg-indigo-500/10 w-fit px-2 py-0.5 rounded border border-indigo-500/20">
                                ✨ Tip: Manual entries take priority over resume parsing.
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-10">

                        { }
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-indigo-500/30 ring-1 ring-indigo-500/10">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                📄 Smart Resume Upload <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">AI Powered</span>
                            </h3>
                            <div className="relative border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-xl p-8 transition-colors group text-center cursor-pointer bg-slate-900/50">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="space-y-2">
                                    <div className="mx-auto w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                        <span className="text-2xl">📤</span>
                                    </div>
                                    <p className="text-slate-300 font-medium group-hover:text-indigo-400 transition-colors">
                                        {file ? file.name : "Click to upload PDF Resume"}
                                    </p>
                                    <p className="text-xs text-slate-500">Supported Format: PDF (Max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Personal Information</h3>
                                <div className="h-px bg-slate-800 w-full"></div>
                            </div>

                            <div>
                                <label className={labelStyle}>Full Name</label>
                                <input name="name" placeholder="John Doe" className={inputStyle} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className={labelStyle}>Age</label>
                                <input name="age" type="number" placeholder="25" className={inputStyle} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={labelStyle}>Experience (Years)</label>
                                <input name="experience" type="number" placeholder="5" className={inputStyle} onChange={handleChange} />
                            </div>
                        </div>

                        { }
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Professional Portfolio</h3>
                                <div className="h-px bg-slate-800 w-full"></div>
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelStyle}>Skills (Comma separated)</label>
                                <input name="skills" placeholder="React, Node.js, Python..." className={inputStyle} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={labelStyle}>Total Projects</label>
                                <input name="totalProjects" type="number" placeholder="12" className={inputStyle} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={labelStyle}>Project Links / Portfolio</label>
                                <input name="projectLinks" placeholder="github.com/profile, portfolio.me" className={inputStyle} onChange={handleChange} />
                                <p className="text-xs text-slate-500 mt-1">We'll scan these links for additional details.</p>
                            </div>
                        </div>

                        { }
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Career Preferences</h3>
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
                                <label className={labelStyle}>Expected Salary per Annum(₹)</label>
                                <input name="expectedSalary" type="number" placeholder="80000" className={inputStyle} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={labelStyle}>Job Types</label>
                                <input name="preferredJobTypes" placeholder="Full-time, Contract" className={inputStyle} onChange={handleChange} />
                            </div>
                        </div>

                        { }
                        <div className="pt-6 border-t border-slate-800">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing Profile...
                                    </>
                                ) : (
                                    <>
                                        🚀 Complete Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}