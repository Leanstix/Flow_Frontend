import Image from "next/image";
import User from "@/public/User.svg";

const ActiveUsers = ({ users }) => {
  return (
    <div className="ml-3">
      <h2 className="font-extrabold text-2xl">Active</h2>
      {users.map((user, index) => (
        <div key={index} className="flex mt-2 overflow-y-scroll h-1/2">
          <Image src={ User } alt={user} width={40} height={40} className="rounded-full"/>
          <div className="my-3 ml-1">{user}</div>
        </div>
      ))}
    </div>
  );
};

export default ActiveUsers;
