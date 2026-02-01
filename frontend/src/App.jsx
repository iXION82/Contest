import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Jobs from "./pages/Jobs";
import RecommendedJobs from "./pages/RecommendedJobs";
import Applications from "./pages/Applications";
import Applicants from "./pages/Applicants";
import CreateUser from "./pages/CreateUser";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Jobs />} />
        <Route path="/signup" element={<CreateUser />} />
        <Route path="/recommend" element={<RecommendedJobs />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/jobs/:jobId/applicants" element={<Applicants />} />
      </Routes>
    </BrowserRouter>
  );
}
