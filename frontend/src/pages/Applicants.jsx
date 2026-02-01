import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getApplicants } from "../api/job.api";

export default function Applicants() {
  const { jobId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplicants(jobId)
      .then((res) => {
        setUsers(res.data.applicants);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jobId]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/provider" className="text-indigo-400 text-sm hover:underline flex items-center gap-2 mb-2">
              ← Back to Job Postings
            </Link>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Applicants <span className="text-slate-500 font-medium text-lg ml-2">({users.length})</span>
            </h2>
            <p className="text-slate-400 mt-1">Review and manage candidates for Job ID: <span className="text-indigo-400 font-mono">{jobId}</span></p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors border border-slate-700">
              Export CSV
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800">
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-400">Candidate</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-400">Contact Information</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-400">Status</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-bold text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{u.name}</div>
                          <div className="text-slate-500 text-xs italic">Applied recently</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-slate-300 text-sm font-medium">{u.email}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">
                        Pending Review
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-indigo-400 hover:text-white font-bold text-sm transition-colors">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-500 italic">No applicants found for this position yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}