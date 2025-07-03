import { Mail, Github, Twitter, Heart, ExternalLink } from "lucide-react";
import newlogo from "@/assets/newlogo-dark.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const footerLinks = {
    product: [
      { name: "Leagues", href: "/leagues" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Create League", href: "/create-league" },
    ],
    support: [
      { name: "FAQ", href: "/faq" },
      { name: "Notices", href: "/notices" },
      { name: "Contact Us", href: "/contact" },
    ],
  };

  return (
    <footer className="relative mt-20 bg-secondarydarkbg text-white">
      {/* Main Footer Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Brand Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <img
                  src={newlogo}
                  alt="Grid Manager Logo"
                  className="h-16 w-16 object-contain"
                />
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Grid Manager
                  </h2>
                  <p className="text-darkmodeCTA font-medium">
                    Fantasy F1 Platform
                  </p>
                </div>
              </div>
              <p className="text-slate-300 text-lg mb-6 max-w-md mx-auto lg:mx-0">
                Experience the thrill of Fantasy F1 like never before! Build
                your dream team, compete with friends, and dominate the
                championship.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://x.com/roshith_prakash"
                  className="w-10 h-10 bg-slate-800 hover:bg-darkmodeCTA rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/roshith-prakash"
                  className="w-10 h-10 bg-slate-800 hover:bg-darkmodeCTA rounded-lg flex items-center justify-center transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="mailto:roshithprakash07@gmail.com"
                  className="w-10 h-10 bg-slate-800 hover:bg-darkmodeCTA rounded-lg flex items-center justify-center transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Product Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Product
                </h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => {
                          navigate(link.href);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-slate-300 cursor-pointer hover:text-darkmodeCTA transition-colors flex items-center gap-2"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Support
                </h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => {
                          navigate(link.href);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-slate-300 cursor-pointer hover:text-darkmodeCTA transition-colors"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-white/5 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-darkmodeCTA mb-1">
                Strategic Gameplay
              </div>
              <div className="text-sm text-slate-400">Built for F1 Fans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-darkmodeCTA mb-1">
                Private Leagues
              </div>
              <div className="text-sm text-slate-400">Play with Friends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-darkmodeCTA mb-1">
                Weekly Scoring
              </div>
              <div className="text-sm text-slate-400">Based on Real Races</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-darkmodeCTA mb-1">
                100% Free to play
              </div>
              <div className="text-sm text-slate-400">No Hidden Costs</div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-center gap-2 text-slate-400">
                <span>© {currentYear} Grid Manager.</span>
                <span>Made with</span>
                <Heart className="w-4 h-4 text-darkmodeCTA fill-current" />
                <span>for F1 fans worldwide.</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span>Powered by Jolpica.</span>
                <span>•</span>
                <span>Roshith Prakash</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <p>
              Grid Manager is not affiliated with Formula 1®. F1® is a
              registered trademark of Formula One Licensing BV.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
