"use client";
import { ConversationList } from './components/ConversationList';
import { Conversation } from './components/Conversation';
import { CreateConversation } from './components/CreateConversation';
import { MessageItem } from './components/MessageItem';
import { useState, useEffect } from "react";

export default function Message() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return(
        <div>
            <Conversation />
            <ConversationList />
            <CreateConversation />
            <MessageItem />
        </div>
    )
}