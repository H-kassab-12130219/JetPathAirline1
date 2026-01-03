import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Login";
import Logout from "../Components/Logout";
import ProfileMenu from "../Components/ProfileMenu";
import DashboardPreview from "../Components/DashboardIPreview";
import Chatbot from "../Components/Chatbot";
import AuthContext from "../Contexts/AuthContext";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";

const Dashboard = () => {
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
    <section>
      <Helmet>
        <title>JetPath-Dashboard</title>
      </Helmet>
      <Login />
      <Logout />
      <ProfileMenu />
      <DashboardPreview />
      <Chatbot />
    </section>
  );
};

export default Dashboard;
