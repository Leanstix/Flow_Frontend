const Announcement = () => {
    return (
      <div className="border rounded-md bg-[#070007] text-white mt-2 p-2">
        <h2 className="font-extrabold text-2xl mt-3">Announcement</h2>
        <p className="mt-2">
          Good day dear User, just to notify you that Flow will be unavailable from 12:00 pm to 1:30 pm as we migrate our database to a more secure server. Thank you for your understanding.
        </p>
        <hr className="my-2"/>
      </div>
    );
  };
  
  export default Announcement;
  