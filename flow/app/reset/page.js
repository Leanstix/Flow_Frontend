"use client"
import VerifyPasswordReset from "./components/reset"
import { useState, useEffect } from "react";

export default function Reset() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return(
        <div>
            <VerifyPasswordReset />
        </div>
    )
}