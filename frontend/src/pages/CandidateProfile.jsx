import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetUserProfile } from "../api/auth";

export default function CandidateProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetUserProfile(userId)
            .then((res) => {
                setUser(res.data.user);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                User not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 text-indigo-400 hover:text-indigo-300 flex items-center gap-2 font-medium transition-colors"
                >
                    ← Back
                </button>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    { }
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative">
                        { }
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-800 pb-10 mb-10">
                            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl shadow-indigo-500/20">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">{user.name}</h1>
                                <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start gap-2">
                                    📧 {user.email}
                                </p>
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700">
                                        🎓 {user.experience} Years Experience
                                    </span>
                                    <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700">
                                        💼 {user.expectedSalary ? `$${user.expectedSalary}/yr` : 'Salary N/A'}
                                    </span>
                                    <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700">
                                        📍 {user.preferredLocations?.[0] || 'Remote'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            { }
                            <div>
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Core Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills?.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            { }
                            <div>
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Career Preferences</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <span className="text-slate-500">Roles:</span>
                                        <span className="font-medium">{user.preferredRoles?.join(", ")}</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <span className="text-slate-500">Job Type:</span>
                                        <span className="font-medium">{user.preferredJobTypes?.join(", ")}</span>
                                    </li>
                                </ul>
                            </div>

                            { }
                            <div className="md:col-span-2">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Featured Projects</h3>
                                {user.projectLinks?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.projectLinks.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-300 font-medium truncate">{link}</span>
                                                    <span className="text-slate-600 group-hover:text-indigo-400 transition-colors">↗</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic">No projects listed.</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
