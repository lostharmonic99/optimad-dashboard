
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  Menu, 
  X 
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: <LayoutDashboard className="h-4 w-4 mr-2" /> 
    },
    { 
      name: "Create Campaign", 
      path: "/create", 
      icon: <PlusCircle className="h-4 w-4 mr-2" /> 
    },
    { 
      name: "Analytics", 
      path: "/analytics", 
      icon: <BarChart3 className="h-4 w-4 mr-2" /> 
    },
    { 
      name: "Settings", 
      path: "/settings", 
      icon: <Settings className="h-4 w-4 mr-2" /> 
    },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-xl font-semibold bg-gradient-to-r from-optimad-600 to-optimad-800 bg-clip-text text-transparent">
                Optimad
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link inline-flex items-center ${
                  location.pathname === item.path ? "nav-link-active" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} animate-fade-in-up`}>
        <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link block ${
                location.pathname === item.path 
                  ? "nav-link-active" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                {item.icon}
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
