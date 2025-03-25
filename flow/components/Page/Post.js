import Image from "next/image";
import Like from "@/public/Icons/like_black.svg";
import Repost from "@/public/Icons/Repost.svg";
import Comment from "@/public/Icons/Comment.svg";
import Report from "@/public/Icons/Report.svg";
import View from "@/public/Icons/View.svg";
import User from "@/public/User.svg";
import { fecthComments,getFeedPosts, repost, toggleLike, addComment } from "@/app/lib/api";

const Post = ({ name, username, content, likes, reposts, comments, reports, views }) => {
  const fetchFriendRequests = async () => {
      try {
        const fetchedRequests = await getFriendRequests();
        setFriendRequests(fetchedRequests);
      } catch (err) {
        console.error("Failed to fetch friend requests:", err);
        console.log("Could not load friend requests. Please try again later.");
      }
    };

  return (
    <div className="text-white mt-3 p-4 bg-[#1F062E] rounded-lg">
      <div className="flex items-center">
        <Image src={User} alt="User" width={50} height={50} className="rounded-full"/>
        <div className="ml-2">
          <div className="font-semibold">{name}</div>
          <div className="text-gray-400">@{username}</div>
        </div>
      </div>

      <p className="mt-3">{content}</p>
      <hr className="mt-2"/>

      <div className="flex justify-between mt-3 text-gray-300">
        <div className="flex items-center space-x-1">
          <Image src={Like} alt="Like" width={24} height={24}/>
          <span>{likes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Image src={Comment} alt="Comment" width={24} height={24}/>
          <span>{comments}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Image src={Repost} alt="Repost" width={24} height={24}/>
          <span>{reposts}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Image src={View} alt="View" width={24} height={24}/>
          <span>{views}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Image src={Report} alt="Report" width={24} height={24}/>
          <span>{reports}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
