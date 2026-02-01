import { useEffect, useState } from "react";
import { recommendJobs, applyJob } from "../api/job.api";
import JobCard from "../components/JobCard";

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const userId = "user123";

  useEffect(() => {
    recommendJobs(userId).then(res =>
      setJobs(res.data.recommendations)
    );
  }, []);

  return (
    <>
      <h2>Recommended Jobs</h2>
      {jobs.map(job => (
        <JobCard
          key={job.jobId}
          job={job}
          onApply={(jobId) => applyJob(userId, jobId)}
        />
      ))}
    </>
  );
}
