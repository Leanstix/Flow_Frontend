import MessagePage from "./MessagePage"; // Client Component

export async function generateStaticParams() {
  return [
    { messages: '1' }, // Add more params as needed
  ];
}

export default function Page() {
  return <MessagePage />;
}
