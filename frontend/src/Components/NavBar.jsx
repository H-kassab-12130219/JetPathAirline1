import React from "react";
import { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import { CgProfile } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { toast } from "react-hot-toast";

const NavBar = () => {
  const { setLoginWindow, setProfileWindow, ProfileWindow, UserInfo } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const CreateToast = (message) => {
    toast.error(message);
  };
  return (
    <section className=" z-[100] text-sm relative font-sans flex justify-end  w-full  h-20">
      <ProfileMenu />
      <div
        className={
          location.pathname === "/dashboard" ||
          location.pathname === "/profile" ||
          location.pathname === "/destinations" ||
          location.pathname === "/destinations/asia" ||
          location.pathname === "/destinations/africa" ||
          location.pathname === "/destinations/europe" ||
          location.pathname === "/destinations/america" ||
          location.pathname === "/help" ||
          location.pathname === "/loyalty" ||
          location.pathname === "/admin"
            ? "absolute font-Play font-semibold left-10 top-6 text-2xl text-Custom-Nav"
            : "absolute font-Play font-semibold left-10 text-2xl bg-red-800 w-[130px] h-[150px] rounded-b-lg shadow-lg text-Custom-Nav"
        }
      >
        <p
          onClick={() => navigate("/")}
          className={
            location.pathname === "/dashboard" ||
            location.pathname === "/profile" ||
            location.pathname === "/destinations" ||
            location.pathname === "/destinations/asia" ||
            location.pathname === "/destinations/africa" ||
            location.pathname === "/destinations/europe" ||
            location.pathname === "/destinations/america" ||
            location.pathname === "/help" ||
            location.pathname === "/loyalty" ||
            location.pathname === "/admin"
              ? "text-white cursor-pointer font-bold tracking-wider"
              : "ml-7 mt-20 text-white cursor-pointer font-bold tracking-wider"
          }
        >
          Jetpath
        </p>
      </div>
      <div className="flex justify-end gap-[420px] items-center">
        <div className="flex gap-4 text-Custom-Nav">
          {!UserInfo?.isAdmin ? (
            <>
              <p
                onClick={() => {
                  if (localStorage.getItem("isLoggedIn")) {
                    navigate("/dashboard");
                  } else {
                    CreateToast("You need to be logged in to use this feature");
                  }
                }}
                className="hover:border-b cursor-pointer transition-all ease-in-out"
              >
                Book
              </p>

              <p
                onClick={() => {
                  navigate("/destinations");
                }}
                className="hover:border-b cursor-pointer transition-all  ease-in-out"
              >
                Destinations
              </p>
              <p
                onClick={() => {
                  navigate("/loyalty");
                }}
                className="hover:border-b cursor-pointer transition-all ease-in-out"
              >
                Loyalty
              </p>
              <p
                onClick={() => {
                  navigate("/help");
                }}
                className="hover:border-b  cursor-pointer transition-all  ease-in-out"
              >
                Help
              </p>
            </>
          ) : (
            <p
              onClick={() => {
                navigate("/admin");
              }}
              className="hover:border-b cursor-pointer transition-all ease-in-out text-red-400 font-semibold"
            >
              Admin
            </p>
          )}
        </div>
        <div className="flex gap-3 pr-5 text-Custom-Nav">
          {localStorage.getItem("isLoggedIn") ? (
            <CgProfile
              size={25}
              className=" cursor-pointer  hover:text-red-800 transition-all delay-100 ease-in-out"
              onClick={() => setProfileWindow((prev) => !prev)}
            />
          ) : (
            <p className="cursor-pointer" onClick={() => setLoginWindow(true)}>
              Login
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
export default NavBar;
