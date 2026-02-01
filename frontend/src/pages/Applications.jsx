import { useEffect, useState } from "react";
import { getApplications } from "../api/user.api";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const userId = "user123";

  useEffect(() => {
    getApplications(userId).then(res =>
      setApps(res.data.applications)
    );
  }, []);

  return (
    <>
      <h2>My Applications</h2>
      {apps.map(job => (
        <p key={job.jobId}>
          {job.title} — {job.company}
        </p>
      ))}
    </>
  );
}
