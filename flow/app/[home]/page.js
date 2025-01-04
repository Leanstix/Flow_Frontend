import dynamic from 'next/dynamic';

const UserHome = dynamic(() => import('./[home]'), { ssr: false });

export default function Page() {
  return <UserHome />;
}
