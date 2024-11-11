"use client"
import ActivateAccount from "./component/AccountActivation"
import { useState, useEffect } from "react"

export default function AccountActivation() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        }, []);
    
        if (!isMounted) return null;
    
  return (
    <div><ActivateAccount /></div>
  )
}
