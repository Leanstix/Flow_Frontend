"use client"

import Marketplace from "./components/market";
import { useState, useEffect } from "react";
import ErrorBoundary from "../lib/ErrorBoundary";

export default function Market() {
    const [IsMounted, SetIsMounted] = useState(false);

    useEffect(() => {
        SetIsMounted(true);
    }, []);

    if (!IsMounted) return null;

    return(
        <div>
            <ErrorBoundary>
                <Marketplace />
            </ErrorBoundary>
        </div>
    )
}