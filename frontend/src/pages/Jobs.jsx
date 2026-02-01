import { useEffect, useState } from "react";
import { getAllJobs, applyJob } from "../api/job.api";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const userId = "user123"; // TEMP USER

  useEffect(() => {
    getAllJobs().then(res => setJobs(res.data.jobs));
  }, []);

  const handleApply = async (jobId) => {
    try {
      await applyJob(userId, jobId);
      alert("Applied successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <>
      <h2>All Jobs</h2>
      {jobs.map(job => (
        <JobCard
          key={job.jobId}
          job={job}
          onApply={handleApply}
        />
      ))}
    </>
  );
}
