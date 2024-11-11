"use client"
import SignUp from "./components/SignUp";
import { useState, useEffect } from "react"

export default function Signup() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
    setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
    <div><SignUp /></div>
    )
}
