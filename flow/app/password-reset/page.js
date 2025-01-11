"use client"
import PasswordResetComponent from "./components/PasswordReset"
import { useState, useEffect } from "react";

export default function Message() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return(
        <div>
            <PasswordResetComponent />
        </div>
    )
}