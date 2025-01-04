// app/[home]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { home } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (home) {
      // Fetch the dynamic data here based on "home" parameter
      fetch(`/api/data?home=${home}`)
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, [home]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dynamic Page for {home}</h1>
      <p>{data.content}</p>
    </div>
  );
}
