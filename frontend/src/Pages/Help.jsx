import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ContactUs from "../Components/ContactUs";
import AuthContext from "../Contexts/AuthContext";
import { toast } from "react-hot-toast";

const Help = () => {
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
      <ContactUs />
    </section>
  );
};

export default Help;
