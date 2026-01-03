import React, { useState } from "react";
import { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";

const HeroSection = () => {
  const { Locations, CreateToast } = useContext(AuthContext);
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [budget, setBudget] = useState("");

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-800/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Are you ready to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                  take off?
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                From runway to skyway, embark on a journey of endless possibilities. 
                Let your wanderlust guide you with us.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-red-600">150+</p>
                <p className="text-sm text-gray-400">Destinations</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">24/7</p>
                <p className="text-sm text-gray-400">Support</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">5★</p>
                <p className="text-sm text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Side - Search Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Let's Fly!</h2>
              <p className="text-gray-300">We'll handle everything for you</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Destination */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" />
                  Where to?
                </label>
                <select
                  className="w-full h-12 rounded-xl bg-white/95 text-gray-900 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/50 focus:outline-none transition-all px-4 font-medium"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">Choose destination...</option>
                  {Locations.map((item) => {
                    const locationId =
                      item.locationId ?? item.id ?? item.name ?? "";
                    const locationName =
                      item.locationName ??
                      item.name ??
                      item.country ??
                      "Unknown";
                    return (
                      <option key={locationId} value={locationName}>
                        {locationName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Trip Type & Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <FaPlane className="text-red-600" />
                    Trip Type
                  </label>
                  <select
                    className="w-full h-12 rounded-xl bg-white/95 text-gray-900 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/50 focus:outline-none transition-all px-4 font-medium"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                  >
                    <option value="">Choose...</option>
                    <option value="Round Trip">Round Trip</option>
                    <option value="One way">One way</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <FaCalendarAlt className="text-red-600" />
                    Departure Date
                  </label>
                  <input
                    className="w-full h-12 rounded-xl bg-white/95 text-gray-900 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/50 focus:outline-none transition-all px-4 font-medium"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Budget Filter */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium flex items-center gap-2">
                  <FaDollarSign className="text-red-600" />
                  Max Budget <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  className="w-full h-12 rounded-xl bg-white/95 text-gray-900 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/50 focus:outline-none transition-all px-4 font-medium"
                  type="number"
                  placeholder="Enter max price"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={() => {
                  if (!localStorage.getItem("isLoggedIn")) {
                    CreateToast("You need to be logged in to use this feature");
                    return;
                  }

                  if (!destination) {
                    CreateToast("Please select a destination");
                    return;
                  }

                  if (!departureDate) {
                    CreateToast("Please select a departure date");
                    return;
                  }

                  sessionStorage.setItem("searchDestination", destination);
                  sessionStorage.setItem("searchTripType", tripType || "Round Trip");
                  sessionStorage.setItem("searchDepartureDate", departureDate);
                  if (budget) {
                    sessionStorage.setItem("searchBudget", budget);
                  } else {
                    sessionStorage.removeItem("searchBudget");
                  }
                  
                  navigate("/dashboard");
                }}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaPlane className="rotate-[-45deg]" />
                Search Flights
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
