import Image from "next/image";

const Header = () => {
  return (
    <div className="flex pt-2 px-2">
      <Image src="/profile-icon.svg" alt="Profile" width={40} height={40} className="rounded-full"/>
      <input placeholder="Search" className="border rounded-full bg-[#D9D9D9] text-center ml-2"/>
    </div>
  );
};

export default Header;
