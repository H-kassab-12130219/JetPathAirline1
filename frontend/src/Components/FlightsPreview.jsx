import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { getImageUrl } from "../utils/imageHelper";
import { FaPlane, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

const FlightsPreview = () => {
  const { Flights, setBookClick, fetchFlightById, CreateToast } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const scrollToDiv = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  const topFlights = Flights.slice(0, 3);

  return (
    <section className="w-full py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Top <span className="text-red-600">Destinations</span>
          </h2>
          <p className="text-xl text-gray-300">
            Explore our most popular destinations for your next adventure!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {topFlights.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => {
                sessionStorage.setItem("flightid", item.flightId);
                if (!localStorage.getItem("isLoggedIn")) {
                  CreateToast("You need to be logged in to use this feature");
                } else {
                  fetchFlightById();
                  setBookClick(true);
                  scrollToDiv();
                }
              }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={getImageUrl(item.imgsrc)}
                  alt={item.arrivalLocation}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <p className="text-xs text-white/80">From</p>
                  <p className="text-2xl font-bold text-white">${item.price}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-gradient-to-b from-slate-900/95 to-slate-900">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {item.arrivalLocation}
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-red-600" />
                      {item.continent}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaPlane className="text-red-600" />
                    <span className="text-sm">{item.roundTrip}</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all group-hover:gap-3">
                    Book Now
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/destinations")}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-red-600/50 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            View All Destinations
          </button>
        </div>
      </div>
    </section>
  );
};

export default FlightsPreview;
