import Image from "next/image";

const Post = ({ name, username, content }) => {
  return (
    <div className="text-white mt-3">
      <div className="flex">
        <Image src="/profile-icon.svg" alt="User" width={50} height={50} className="rounded-full"/>
        <div className="ml-2">
          <div className="font-semibold">{name}</div>
          <div>@{username}</div>
        </div>
      </div>
      <p className="mt-3">{content}</p>
      <hr className="mt-1"/>
      <div className="grid grid-cols-5 mt-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <Image key={i} src="/icon.svg" alt="Icon" width={40} height={40} className="rounded-full"/>
        ))}
      </div>
    </div>
  );
};

export default Post;
