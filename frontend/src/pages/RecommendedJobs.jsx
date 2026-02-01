import { useEffect, useState } from "react";
import { recommendJobs, applyJob } from "../api/job.api";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || userId === "undefined") {
      alert("Please create a profile first to get recommendations.");
      window.location.href = "/create";
      return;
    }

    setLoading(true);
    recommendJobs(userId)
      .then((res) => {
        setJobs(res.data.recommendations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setLoading(false);
      });
  }, [userId]);

  const handleApply = async (jobId) => {
    try {
      await applyJob(userId, jobId);
      alert("Application successful!");
    } catch (err) {
      console.log(err);
      alert("Error applying for this recommendation.");
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="min-h-screen bg-slate-950 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">

          {/* Header with AI/Recommendation Context */}
          <div className="mb-12 relative flex items-end justify-between">
            <div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/10 blur-[100px] rounded-full"></div>

              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 uppercase tracking-widest">
                  AI Powered
                </span>
                <span className="text-slate-500 text-sm italic">Updated just now</span>
              </div>

              <h2 className="text-4xl font-extrabold text-white tracking-tight">
                Recommended <span className="text-indigo-500 underline decoration-indigo-500/20">for You</span>
              </h2>
              <p className="text-slate-400 mt-3 text-lg max-w-2xl">
                We've analyzed your skills and preferences to find the perfect matches for your next career move.
              </p>
            </div>

            {jobs.length > 0 && !loading && (
              <button
                onClick={async () => {
                  if (!window.confirm(`Are you sure you want to apply to ${jobs.length} jobs?`)) return;

                  let successCount = 0;
                  for (const job of jobs) {
                    try {
                      await applyJob(userId, job._id);
                      successCount++;
                    } catch (e) {
                      console.error(`Failed to apply to ${job._id}`, e);
                    }
                  }
                  alert(`Successfully applied to ${successCount} jobs!`);
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <span>🚀</span> Apply to All {jobs.length} Jobs
              </button>
            )}
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-72 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <div key={job._id} className="relative transition-transform duration-300 hover:-translate-y-2">
                  {/* Decorative Match Label */}
                  <div className="absolute -top-3 -right-3 z-10 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded shadow-lg transform rotate-3">
                    {Math.min(Math.round(job.score), 100)}% MATCH
                  </div>

                  <JobCard
                    job={job}
                    onApply={handleApply}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State for no recommendations */
            <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-slate-800 backdrop-blur-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white">Refining your matches...</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                Complete your profile with more skills to see high-quality recommendations here.
              </p>
              <button className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all">
                Update Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}