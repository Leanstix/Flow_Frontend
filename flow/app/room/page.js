"use client"
import JoinCreateRoom from "./components/rooms";
import { useState, useEffect } from "react";

export default function Message() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return(
        <div>
            <JoinCreateRoom />
        </div>
    )
}