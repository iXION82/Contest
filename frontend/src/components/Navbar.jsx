import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Helper to determine if a link is active
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => `
    text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md
    ${isActive(path) 
      ? "text-indigo-400 bg-indigo-500/10" 
      : "text-slate-400 hover:text-white hover:bg-slate-800"
    }
  `;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
                Job<span className="text-indigo-500">Portal</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <Link to="/" className={linkStyle("/")}>
              Jobs
            </Link>
            <Link to="/recommend" className={linkStyle("/recommend")}>
              Recommended
            </Link>
            <Link to="/applications" className={linkStyle("/applications")}>
              Applications
            </Link>
            
            <div className="h-6 w-px bg-slate-800 mx-2 hidden sm:block"></div>
            
            <Link 
              to="/create" 
              className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}