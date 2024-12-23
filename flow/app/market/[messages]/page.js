"use client"

import Message from "./components/mesage";
import { useState, useEffect } from "react";
import ErrorBoundary from "@/app/lib/ErrorBoundary";

export default function Page() {
    const [IsMounted, SetIsMounted] = useState(false);

    useEffect(() => {
        SetIsMounted(true);
    }, []);

    if (!IsMounted) return null;

    return(
        <div>
            <ErrorBoundary>
                <Message />
            </ErrorBoundary>
        </div>
    )
}