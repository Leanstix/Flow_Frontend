import Image from "next/image";
import User from "@/public/User.svg";

const Header = () => {
  return (
    <div className="flex pt-2 px-2">
      <Image src={ User } alt="Profile" width={40} height={40} className="rounded-full"/>
      <input placeholder="Search" className="border rounded-full bg-[#D9D9D9] text-center ml-2"/>
    </div>
  );
};

export default Header;
