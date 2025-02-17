"use client";

import { useEffect, useState } from "react";
import { 
    getFeedPosts,  
    createPost,
    toggleLike,
    addComment,
    deleteComment,
    deletePost,
    acceptFriendRequest,
    getFriendRequests
} from "@/app/lib/api";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Trash2, Send } from "lucide-react";
import Image from "next/image";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState("");
    const [friendRequests, setFriendRequests] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getFeedPosts().then((data) => {  
            setPosts(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        getFriendRequests().then((data) => {
            setFriendRequests(data);
        });
    }, []);

    const handleAcceptFriendRequest = async (id) => {
        await acceptFriendRequest(id);
        setFriendRequests(friendRequests.filter(request => request.id !== id));
    };

    const handleLike = async (postId) => {
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
        ));
        await toggleLike(postId);
    };

    const handleAddPost = async () => {
        if (!newPost.trim()) return;
        const newPostData = await createPost({ content: newPost });
        setPosts([newPostData, ...posts]);
        setNewPost("");
    };

    return (
        <div className="max-w-2xl mx-auto py-6">
            {/* Create Post Section */}
            <Card className="mb-6 p-4">
                <Textarea
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-2"
                />
                <Button onClick={handleAddPost} className="w-full">Post</Button>
            </Card>

            {/* Friend Requests */}
            {friendRequests.length > 0 && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold mb-2">Friend Requests</h3>
                    {friendRequests.map(request => (
                        <div key={request.id} className="flex justify-between items-center mb-2">
                            <span>{request.name}</span>
                            <Button onClick={() => acceptFriendRequest(request.id)}>Accept</Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Posts */}
            {loading ? (
                <Skeleton className="h-40 w-full rounded-lg" />
            ) : (
                (posts || []).map(post => (
                    <Card key={post.id} className="mb-4">
                        <CardHeader className="flex items-center space-x-3">
                            <Image 
                                src={post.user?.avatar || "/default-avatar.png"} 
                                alt="User Avatar" 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                            />
                            <div>
                                <h4 className="font-semibold">{post.user?.name || "Unknown User"}</h4>
                                <p className="text-sm text-gray-500">
                                    {post.created_at ? new Date(post.created_at).toLocaleString() : "Unknown Date"}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2">{post.content || "No content available"}</p>
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" onClick={() => handleLike(post.id)}>
                                    <Heart className={post.isLiked ? "text-red-500" : "text-gray-500"} size={18}/> 
                                    <span className="ml-1">{post.likes ?? 0}</span>
                                </Button>
                                <Button variant="ghost">
                                    <Send size={18} />
                                </Button>
                                <Button variant="ghost" onClick={() => deletePost(post.id)}>
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
