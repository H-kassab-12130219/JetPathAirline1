import React, { useState } from "react";
import { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WebsiteReviews = () => {
  const { Reviews, fetchAddReview, CreateToast } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [textArea, settextArea] = useState("");

  const navigate = useNavigate();

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };
  
  const renderStarRating = (stars) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        size={20}
        className={index < stars ? "text-yellow-400" : "text-gray-400"}
      />
    ));
  };

  const handleOnClickSubmit = async () => {
    if (localStorage.getItem("isLoggedIn")) {
      await fetchAddReview(textArea, rating);
      navigate(0);
    } else {
      CreateToast("You need to be logged in to use this feature");
    }
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Reviews Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">
              Top <span className="text-red-600">Reviews</span>
            </h2>
            <p className="text-xl text-gray-300">
              See what our customers are saying about us
            </p>
          </div>

          {Reviews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Reviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-lg">
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {item.username}
                      </h3>
                      <div className="flex gap-1">
                        {renderStarRating(item.stars)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {item.userMessage}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>

        {/* Leave Review Section */}
        <div className="border-t border-white/10 pt-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">
                Leave a <span className="text-red-600">Review</span>
              </h2>
              <p className="text-gray-300">
                Share your experience and help us improve!
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">
                    Your Review
                  </label>
                  <textarea
                    onChange={(e) => {
                      settextArea(e.target.value);
                    }}
                    placeholder="Share your thoughts about your experience..."
                    className="w-full h-32 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all resize-none"
                    value={textArea}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">
                    Rating
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        size={32}
                        className={`cursor-pointer transition-all duration-200 ${
                          index < rating
                            ? "text-yellow-400 scale-110"
                            : "text-gray-500 hover:text-yellow-300"
                        }`}
                        onClick={() => handleStarClick(index)}
                      />
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-gray-400 text-sm mt-2">
                      {rating} out of 5 stars
                    </p>
                  )}
                </div>

                <button
                  onClick={handleOnClickSubmit}
                  disabled={!rating || !textArea.trim()}
                  className="w-full h-12 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteReviews;
