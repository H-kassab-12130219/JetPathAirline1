import React from "react";
import { IoIosWifi } from "react-icons/io";
import { IoFastFood } from "react-icons/io5";
import { FaMobileAlt } from "react-icons/fa";
import { FaShieldAlt, FaHeadset } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaMobileAlt className="text-5xl" />,
      title: "The JetPath App",
      description: "Explore the world with The JetPath App – your personal journey planner for booking and managing trips on the go. Compatible with iPad, iPhone, Apple Watch, and Android phone.",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      icon: <IoIosWifi className="text-5xl" />,
      title: "Free Wi-Fi in the Sky",
      description: "Now it's free to email, post or tweet from your seat on all of our A330 and most of our Boeing aircraft. Enjoy 10MB of data for free, or buy 500MB for just $1 USD.",
      gradient: "from-purple-600 to-purple-800"
    },
    {
      icon: <IoFastFood className="text-5xl" />,
      title: "Tastiest Food",
      description: "Enjoy fast food perks on your flight! Satisfy your cravings with delicious snacks and meals while soaring through the skies. Elevate your travel experience!",
      gradient: "from-orange-600 to-orange-800"
    },
    {
      icon: <FaShieldAlt className="text-5xl" />,
      title: "Safe & Secure",
      description: "Your safety is our top priority. We maintain the highest standards of security and follow all international aviation safety protocols.",
      gradient: "from-green-600 to-green-800"
    },
    {
      icon: <FaHeadset className="text-5xl" />,
      title: "24/7 Support",
      description: "Our dedicated customer service team is available around the clock to assist you with any questions or concerns about your journey.",
      gradient: "from-red-600 to-red-800"
    }
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-red-600">JetPath</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience world-class service and amenities that make every journey memorable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`text-white mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <button className="text-red-400 hover:text-red-300 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;