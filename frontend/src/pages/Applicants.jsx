import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicants } from "../api/job.api";

export default function Applicants() {
  const { jobId } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getApplicants(jobId).then(res =>
      setUsers(res.data.applicants)
    );
  }, [jobId]);

  return (
    <>
      <h2>Applicants</h2>
      {users.map(u => (
        <p key={u.userId}>
          {u.name} ({u.email})
        </p>
      ))}
    </>
  );
}
