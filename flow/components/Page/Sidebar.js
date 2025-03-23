const Sidebar = () => {
    const links = ["Home", "Trending", "Requests", "Message", "Groups", "Market", "Notification", "Events", "Logout"];
  
    return (
      <div className="col-span-3 bg-[#070007] border-r border-white py-3 px-2">
        {links.map((link, index) => (
          <div key={index} className={`mb-3 w-full py-2 rounded-full text-2xl font-semibold text-center ${link === "Home" ? "bg-white text-black" : "text-white"}`}>
            {link}
          </div>
        ))}
      </div>
    );
  };
  
  export default Sidebar;
  