import Image from "next/image";
import Like from "@/public/Icons/like_black.svg";
import Repost from "@/public/Icons/Repost.svg";
import Comment from "@/public/Icons/Comment.svg";
import Report from "@/public/Icons/Report.svg";
import View from "@/public/Icons/View.svg";

const Announcement = () => {
  return (
    <div className="border rounded-md bg-[#070007] text-white p-3">
      <h2 className="font-extrabold text-2xl mt-3">Announcement</h2>
      <p className="mt-2">
        Good day dear User, just to notify you that Flow will be unavailable from 12:00 pm to 1:30 pm as we migrate our database to a more secure server. Thank you for your understanding.
      </p>
      <hr className="my-2" />
      
      {/* Improved Icon Layout */}
      <div className="flex justify-between items-center mt-1 mb-5">
        {[Like, Comment, Repost, View, Report].map((icon, index) => (
          <Image key={index} src={icon} alt="Icon" width={24} height={24} />
        ))}
      </div>
    </div>
  );
};

export default Announcement;
