import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Jobs from "./pages/Jobs";
import RecommendedJobs from "./pages/RecommendedJobs";
import Applications from "./pages/Applications";
import Applicants from "./pages/Applicants";
import CreateUser from "./pages/CreateUser";

import ProviderDashboard from "./pages/ProviderDashboard";
import AddJob from "./pages/AddJob";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User */}
        <Route path="/" element={<Jobs />} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/recommend" element={<RecommendedJobs />} />
        <Route path="/applications" element={<Applications />} />

        {/* Provider */}
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/provider/add" element={<AddJob />} />

        {/* Shared */}
        <Route path="/jobs/:jobId/applicants" element={<Applicants />} />
      </Routes>
    </BrowserRouter>
  );
}
