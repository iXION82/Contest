import { useEffect, useState } from "react";
import { getApplications } from "../api/user.api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setLoading(true);
    getApplications(userId)
      .then((res) => {
        setApps(res.data.applications);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  return (
    <>
       <div>
        <Navbar/>
       </div>
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            My <span className="text-indigo-500">Applications</span>
          </h2>
          <p className="text-slate-400 mt-2 text-lg">
            Track the status of your journey with top companies.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : apps.length > 0 ? (
          <div className="space-y-4">
            {apps.map((job) => (
              <div 
                key={job.jobId} 
                className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Job & Company Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-xl border border-slate-700 group-hover:bg-indigo-500/10 transition-colors">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-slate-400 font-medium">{job.company}</p>
                    </div>
                  </div>

                  {/* Status & Date Tracking */}
                  <div className="flex flex-col md:items-end gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 uppercase tracking-widest">
                      Applied
                    </span>
                    <p className="text-slate-500 text-xs italic">
                      Submitted on Feb 1, 2026
                    </p>
                  </div>

                </div>

                {/* Footer / Quick Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                   <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1">
                     View Original Listing ↗
                   </button>
                   <span className="text-slate-600 text-xs">Job ID: {job.jobId}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <div className="text-5xl mb-4 text-slate-700">📄</div>
            <h3 className="text-xl font-bold text-slate-300">No applications yet</h3>
            <p className="text-slate-500 mt-2">Start your career journey by applying to some jobs!</p>
            <Link to={"/"}>
            <button  className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all font-semibold">
               Browse Jobs
            </button>
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
}