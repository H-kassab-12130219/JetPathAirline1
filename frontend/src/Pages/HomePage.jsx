import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../Components/NavBar";
import HeroSection from "../Components/HeroSection";
import Features from "../Components/Features";
import FlightsPreview from "../Components/FlightsPreview";
import WebsiteReviews from "../Components/WebsiteReviews";
import Footer from "../Components/Footer";
import AuthContext from "../Contexts/AuthContext";
import { toast } from "react-hot-toast";

const HomePage = () => {
  const { UserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (UserInfo?.isAdmin) {
      toast.error("Admins can only access the Admin Panel");
      navigate("/admin");
    }
  }, [UserInfo, navigate]);

  if (UserInfo?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Airlines Booking</title>
      </Helmet>

      <main className="flex-grow">
        <HeroSection />
        <Features />
        <FlightsPreview />
        <WebsiteReviews />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
