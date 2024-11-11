"use client"
import ActivationMessage from "./component/ActivationMessage";
import { useState, useEffect } from "react";

export default function ActivateAccount() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
    setIsMounted(true);
    }, []);

    if (!isMounted) return null;


  return (
    <div>< ActivationMessage/></div>
  )
}
