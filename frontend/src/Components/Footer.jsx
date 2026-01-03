import React from "react";
import { FaFacebook, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const socialLinks = [
    { icon: <FaFacebook size={20} />, name: "Facebook", color: "hover:text-blue-500" },
    { icon: <RiInstagramFill size={20} />, name: "Instagram", color: "hover:text-pink-500" },
    { icon: <FaTiktok size={20} />, name: "TikTok", color: "hover:text-black" },
    { icon: <FaXTwitter size={20} />, name: "Twitter", color: "hover:text-blue-400" },
  ];

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Destinations", path: "/destinations" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Help", path: "/help" },
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-slate-950 to-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="text-red-600">JetPath</span> Airlines
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for seamless travel experiences. Fly with confidence and explore the world with us.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 ${social.color}`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-red-600 transition-all duration-200"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaPhone className="text-red-600 mt-1 flex-shrink-0" />
                <span>+961 22334455</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaEnvelope className="text-red-600 mt-1 flex-shrink-0" />
                <span>support@jetpath.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaMapMarkerAlt className="text-red-600 mt-1 flex-shrink-0" />
                <span>Beirut, Lebanon</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for exclusive deals and travel tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all text-sm"
              />
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-semibold text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} JetPath Airlines. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
