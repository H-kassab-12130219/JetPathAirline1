import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";

const ProfileMenu = () => {
  const { ProfileWindow, setProfileWindow, setLogoutWindow, CreateToast, UserInfo } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    ProfileWindow && (
      <div
        ref={menuRef}
        className="profile-menu w-auto h-30 p-4 top-14 right-11 bg-Custom-HeroO absolute rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-lg z-[100]"
        onClick={handleClick}
      >
        <ol className="text-white">
          {!UserInfo?.isAdmin ? (
            <>
              <li
                className="cursor-pointer hover:text-red-800 transition-all delay-100 ease-in-out"
                onClick={() => {
                  navigate("/");
                  setProfileWindow(false);
                  navigate(0);
                }}
              >
                Home
              </li>
              <li
                onClick={() => {
                  if (!localStorage.getItem("isLoggedIn")) {
                    CreateToast("You need to be logged in to use this feature");
                  } else {
                    navigate("/profile");
                    navigate(0);
                  }
                }}
                className="cursor-pointer hover:text-red-800 transition-all delay-100 ease-in-out"
              >
                Profile
              </li>
              <li
                onClick={() => {
                  setProfileWindow(false);
                  navigate("/dashboard");
                  navigate(0);
                }}
                className="cursor-pointer  hover:text-red-800 transition-all delay-100 ease-in-out"
              >
                Dashboard
              </li>
            </>
          ) : (
            <li
              onClick={() => {
                if (!localStorage.getItem("isLoggedIn")) {
                  CreateToast("You need to be logged in to use this feature");
                } else {
                  navigate("/profile");
                  navigate(0);
                }
              }}
              className="cursor-pointer hover:text-red-800 transition-all delay-100 ease-in-out"
            >
              Profile
            </li>
          )}
          <li
            onClick={() => setLogoutWindow(true)}
            className="cursor-pointer  hover:text-red-800 transition-all delay-100 ease-in-out"
          >
            Logout
          </li>
        </ol>
      </div>
    )
  );
};

export default ProfileMenu;
