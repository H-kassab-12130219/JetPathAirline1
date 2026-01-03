import React, { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";

const ProfilePhoto = () => {
  const { UserInfo } = useContext(AuthContext);

  const username = UserInfo?.username || UserInfo?.firstName || "U";

  const getFirstLetter = (name) => {
    if (!name || typeof name !== "string") return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <section>
      <div className="rounded-full bg-custom-input w-20 h-20 flex justify-center items-center">
        <p className="text-3xl uppercase text-white">
          {getFirstLetter(username)}
        </p>
      </div>
    </section>
  );
};

export default ProfilePhoto;
