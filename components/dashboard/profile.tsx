import React from "react";

interface ProfileProps {
  username?: string;
}

const Profile: React.FC<ProfileProps> = ({ username = "Saniya Fatima" }) => {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="bg-[#D9D9D9] h-[4.7rem] w-[4.7rem] rounded-full"></div>
      <div className="text-[0.9rem] font-semibold">{username}</div>
    </div>
  );
};

export default Profile;
