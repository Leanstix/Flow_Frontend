import Image from "next/image";
import User from "@/public/User.svg";

const FriendRequest = ({ username }) => {
  return (
    <div className="bg-[#1F062E] p-4 rounded-lg text-center">
      <Image src={ User } alt="User" width={60} height={60} className="rounded-full"/>
      <p className="text-white font-extrabold">{username}</p>
      <button className="bg-[#1F062E] hover:border p-1 mt-2 w-full rounded-md text-white font-bold">Accept</button>
      <button className="bg-[#1F062E] hover:border p-1 mt-1 w-full rounded-md text-white font-bold">Delete</button>
    </div>
  );
};

export default FriendRequest;
