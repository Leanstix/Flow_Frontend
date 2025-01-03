import dynamic from 'next/dynamic';

// Dynamically import UserHome as a Client Component
const UserHome = dynamic(() => import('./UserHome'), { ssr: false });

export async function generateStaticParams() {
  return [
    { params: { home: 'home1' } },
    { params: { home: 'home2' } },
    { params: { home: 'home3' } }
  ];
}

export default function Page() {
  return <UserHome />;
}
