"use client";

import { useEffect, useState } from "react";
import Feed from "./components/feed";

export default function FeedPage() {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) return null;

    return (
        <div><Feed /></div>
    );
}
