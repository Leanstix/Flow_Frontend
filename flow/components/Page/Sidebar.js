const Sidebar = ({ activeSection, setActiveSection }) => {
  const links = ["Home", "Trending", "Requests", "Message", "Groups", "Market", "Notification", "Events", "Logout"];

  return (
    <div className="bg-[#070007] border-r border-white py-3 px-2">
      {links.map((link, index) => (
        <button
          key={index}
          onClick={() => setActiveSection(link.toLowerCase())} // Convert to lowercase for consistency
          className={`mb-3 w-full py-2 rounded-full text-2xl font-semibold text-center ${
            activeSection === link.toLowerCase() ? "bg-white text-black" : "text-white"
          }`}
        >
          {link}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
