import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  BarChart3,
  Calculator,
  BookOpen,
  Globe,
  ShieldCheck,
  TrendingUp,
  LogOut,
  User,
} from "lucide-react";

const navLinks = [
  { to: "/compare", label: "Compare Firms", icon: BarChart3 },
  { to: "/calculators", label: "Calculators", icon: Calculator },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/countries", label: "Countries", icon: Globe },
  { to: "/rules", label: "Rules", icon: ShieldCheck },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0E1A]/95 backdrop-blur-xl border-b border-[#2A3040]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#00D4AA]/10 flex items-center justify-center group-hover:bg-[#00D4AA]/20 transition-colors">
              <TrendingUp className="w-5 h-5 text-[#00D4AA]" />
            </div>
            <span className="text-lg font-bold text-[#F1F2F6]">
              PropFirm<span className="text-[#00D4AA]">Compare</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? "text-[#00D4AA] bg-[#00D4AA]/10"
                    : "text-[#8B92A8] hover:text-[#F1F2F6] hover:bg-[#1A1F2E]"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-[#8B92A8]">
                  <User className="w-4 h-4" />
                  <span className="text-[#F1F2F6]">{user.name || "Trader"}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-[#8B92A8] hover:text-[#FF4757] hover:bg-[#FF4757]/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8B92A8] hover:text-[#F1F2F6]"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="sm"
                    className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] font-semibold"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#8B92A8] hover:text-[#F1F2F6] hover:bg-[#1A1F2E]"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? "text-[#00D4AA] bg-[#00D4AA]/10"
                    : "text-[#8B92A8] hover:text-[#F1F2F6] hover:bg-[#1A1F2E]"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#2A3040] space-y-2">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm text-[#F1F2F6]">{user.name || "Trader"}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-[#8B92A8] hover:text-[#FF4757]"
                  >
                    <LogOut className="w-4 h-4 mr-1" /> Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#8B92A8] hover:text-[#F1F2F6]"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="w-full bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] font-semibold">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
