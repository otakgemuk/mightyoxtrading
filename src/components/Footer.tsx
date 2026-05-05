import { Link } from "react-router";
import { TrendingUp, BarChart3, Calculator, BookOpen, Globe, ShieldCheck } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Compare Firms", to: "/compare", icon: BarChart3 },
    { label: "Calculators", to: "/calculators", icon: Calculator },
    { label: "Learn", to: "/learn", icon: BookOpen },
    { label: "Countries", to: "/countries", icon: Globe },
  ],
  Resources: [
    { label: "Trading Rules", to: "/rules", icon: ShieldCheck },
    { label: "Consistency Calculator", to: "/calculators/consistency", icon: Calculator },
    { label: "ROI Calculator", to: "/calculators/roi", icon: Calculator },
  ],
  Legal: [
    { label: "Privacy Policy", to: "#" },
    { label: "Terms of Service", to: "#" },
    { label: "Disclaimer", to: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1A1F2E] border-t border-[#2A3040]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#00D4AA]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#00D4AA]" />
              </div>
              <span className="text-lg font-bold text-[#F1F2F6]">
                PropFirm<span className="text-[#00D4AA]">Compare</span>
              </span>
            </Link>
            <p className="text-sm text-[#8B92A8] leading-relaxed">
              The most comprehensive futures prop firm comparison platform. Make informed decisions, maximize your payouts.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-[#F1F2F6] mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#8B92A8] hover:text-[#00D4AA] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#2A3040]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#8B92A8]">
              &copy; {new Date().getFullYear()} PropFirmCompare. All rights reserved.
            </p>
            <p className="text-xs text-[#8B92A8] text-center">
              This site contains affiliate links. We may earn commissions at no extra cost to you. 
              Trading futures involves substantial risk of loss.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
