export function Card({ children, className }) {
  return <div className={`border rounded-lg p-4 shadow ${className}`}>{children}</div>;
}

export function CardHeader({ children, className }) {
  return <div className={`border-b pb-2 mb-2 ${className}`}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
