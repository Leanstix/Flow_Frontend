export function Textarea({ className, ...props }) {
    return <textarea className={`border px-3 py-2 rounded-md ${className}`} {...props} />;
}
