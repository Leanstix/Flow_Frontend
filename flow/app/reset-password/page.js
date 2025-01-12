"use client"
import ResetPasswordComponent from "./components/reset-password"
import { useState, useEffect } from "react";

export default function ResetPassword() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return(
        <div>
            <ResetPasswordComponent />
        </div>
    )
}