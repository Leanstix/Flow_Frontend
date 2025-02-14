export default function Card({ children, className = "" }) {
    return (
      <div className={`p-4 shadow-md rounded-lg bg-white ${className}`}>
        {children}
      </div>
    );
  }