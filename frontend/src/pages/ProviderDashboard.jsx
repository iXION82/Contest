import { useEffect, useState } from "react";
import { getCompanyJobs } from "../api/job.api";
import JobCard from "../components/JobCard";
import { Link, useNavigate } from "react-router-dom";

export default function ProviderDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);
    const identifier = user.email || user.companyEmail;

    setLoading(true);
    getCompanyJobs(identifier)
      .then((res) => {
        setJobs(res.data.jobs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching company jobs", err);
        setLoading(false);
      });
  }, [navigate]);

  // Calculate Real Stats
  const totalApplicants = jobs.reduce((acc, job) => acc + (job.peopleIds ? job.peopleIds.length : 0), 0);
  const avgApplicants = jobs.length > 0 ? (totalApplicants / jobs.length).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* Header & Main Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Provider <span className="text-indigo-500">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Manage your active listings and track candidate engagement.
            </p>
          </div>

          <Link to="/provider/add">
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              <span className="text-xl">+</span> Post New Job
            </button>
          </Link>
        </div>

        {/* Stats Overview Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Active Postings", value: jobs.length, color: "text-indigo-400" },
            { label: "Total Applicants", value: totalApplicants, color: "text-emerald-400" },
            { label: "Avg. Applicants/Job", value: avgApplicants, color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-white">Your Postings</h3>
          <div className="h-px bg-slate-800 flex-grow"></div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="relative group">
                <JobCard job={job} />

                {/* Overlay Action for Provider */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/applicants/${job._id}`)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg border border-slate-700 transition-colors"
                  >
                    View Applicants
                  </button>
                  <button className="px-3 py-2 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-500 rounded-lg border border-slate-700 transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <p className="text-slate-500 text-lg">You haven't posted any jobs yet.</p>
            <Link to="/provider/add" className="text-indigo-400 hover:text-indigo-300 font-bold mt-2 inline-block">
              Create your first listing now →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}