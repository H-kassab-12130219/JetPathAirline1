import React from "react";
import Logout from "../Components/Logout";
import ProfileMenu from "../Components/ProfileMenu";
import ProfilePreview from "../Components/ProfilePreview";

const Profile = () => {
  return (
    <section>
      <Logout />
      <ProfileMenu />
      <ProfilePreview />
    </section>
  );
};

export default Profile;
