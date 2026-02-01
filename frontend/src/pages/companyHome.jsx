import { useEffect, useState } from "react";
import api from "../api/axios"; // adjust path if needed

const CompanyHome = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const companyQuery = localStorage.getItem("companyName"); 
  const companyQuery = "Tech Corp";

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        setLoading(true);

        const res = await api.get("/jobs/company", {
          params: { query: companyQuery },
        });

        setJobs(res.data.jobs);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch company jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyQuery) {
      fetchCompanyJobs();
    } else {
      setError("Company not found. Please login again.");
      setLoading(false);
    }
  }, [companyQuery]);

  // Common wrapper for layout consistency
  const Container = ({ children }) => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );

  if (loading) return (
    <Container>
      <div className="p-12 text-center">
        <p className="text-slate-400 animate-pulse text-lg">Loading jobs...</p>
      </div>
    </Container>
  );

  if (error) return (
    <Container>
       <div className="p-12 text-center">
        <p className="text-red-400 font-semibold">{error}</p>
      </div>
    </Container>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-4 border-b border-slate-800/50">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {companyQuery} <span className="text-slate-500 font-normal">— Job Listings</span>
          </h2>
          <p className="text-slate-400 mt-2">Explore current openings and opportunities.</p>
        </div>

        <div className="p-8 space-y-6">
          {jobs.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="group relative bg-slate-800/30 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300"
              >
                {/* Job Title */}
                <h3 className="text-xl font-semibold text-indigo-400 group-hover:text-indigo-300 mb-3">
                  {job.title}
                </h3>

                {/* Job Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-300 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium uppercase text-xs tracking-wider">Location:</span> 
                    {job.location}
                  </p>

                  {job.salary && (
                    <p className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium uppercase text-xs tracking-wider">Salary:</span> 
                      ₹{job.salary}
                    </p>
                  )}

                  {job.jobType && (
                    <p className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium uppercase text-xs tracking-wider">Type:</span> 
                      {job.jobType}
                    </p>
                  )}
                </div>

                {/* Description Divider */}
                {job.description && (
                  <>
                    <div className="h-px bg-slate-700/50 w-full my-3"></div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {job.description}
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyHome;