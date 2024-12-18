"use client"

import Marketplace from "./components/market";
import { useState, useEffect } from "react";

export default function Market() {
    const [IsMounted, SetIsMounted] = useState(false);

    useEffect(() => {
        SetIsMounted(true);
    }, []);

    if (!IsMounted) return null;

    return(
        <div>
            <Marketplace />
        </div>
    )
}