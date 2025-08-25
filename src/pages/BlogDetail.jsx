import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";
import { Heart, Share2, MessageCircle, Calendar, Clock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [comment, setComment] = useState("");
    const [name, setName] = useState("");
    const [comments, setComments] = useState([]);
    const [isLiking, setIsLiking] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const snap = await getDoc(doc(db, "posts", id));
                if (snap.exists()) {
                    const data = snap.data();
                    setPost(data);
                    setLikes(data.likes || 0);
                    setComments(data.comments || []);
                } else {
                    toast.error("Post not found");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                toast.error("Failed to load post");
            }
        };
        fetchPost();
    }, [id]);

    const handleLike = async () => {
        if (isLiking) return;

        setIsLiking(true);
        try {
            const newCount = likes + 1;
            setLikes(newCount);
            await updateDoc(doc(db, "posts", id), { likes: newCount });
            toast.success("Liked!");
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to like post");
            setLikes(likes); // Revert on error
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim() || !name.trim()) {
            toast.error("Please enter both name and comment");
            return;
        }

        setIsSubmittingComment(true);
        try {
            const newComment = {
                name,
                text: comment,
                date: new Date().toISOString(),
                id: Date.now() // Simple unique ID
            };
            const updatedComments = [...comments, newComment];
            setComments(updatedComments);
            await updateDoc(doc(db, "posts", id), { comments: updatedComments });
            setComment("");
            setName("");
            toast.success("Comment added successfully!");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "Unknown date";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getReadingTime = (text) => {
        const wordsPerMinute = 200;
        const words = text ? text.split(/\s+/).length : 0;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    if (!post) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-neutral-300">Loading post...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg text-neutral-100">
            {/* Navigation */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-neutral-300 hover:text-primary-400 transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 pb-12">
                {/* Cover Image */}
                <div className="rounded-xl overflow-hidden mb-8">
                    <img
                        src={post.cover}
                        alt={post.title}
                        className="w-full h-96 object-cover"
                        onError={(e) => {
                            e.target.src = `https://picsum.photos/seed/${id}/800/400`;
                        }}
                    />
                </div>

                {/* Article Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-100">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-neutral-300 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} />
                            <span>{getReadingTime(post.body)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-lg hover:bg-primary-500/20 transition disabled:opacity-50"
                        >
                            <Heart size={20} className={isLiking ? "animate-pulse" : ""} />
                            {likes} {likes === 1 ? 'Like' : 'Likes'}
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-lg hover:bg-primary-500/20 transition"
                        >
                            <Share2 size={20} /> Share
                        </button>
                    </div>
                </div>

                {/* Article Body */}
                <article className="prose prose-invert max-w-none mb-12">
                    <div className="text-lg leading-relaxed text-neutral-200 whitespace-pre-line">
                        {post.body}
                    </div>
                </article>

                {/* Comments Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <MessageCircle size={24} className="text-primary-400" />
                        <h2 className="text-2xl font-semibold text-neutral-100">
                            Comments ({comments.length})
                        </h2>
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleComment} className="bg-surface p-6 rounded-xl space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-elevated border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                            <textarea
                                placeholder="Write your comment..."
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-surface-elevated border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmittingComment}
                            className="bg-gradient-button text-neutral-900 font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {isSubmittingComment ? "Posting..." : "Post Comment"}
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <div className="text-center py-8 text-neutral-400">
                                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-surface p-6 rounded-xl">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-semibold text-primary-400">{comment.name}</h4>
                                        <span className="text-sm text-neutral-400">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                                    </div>
                                    <p className="text-neutral-200">{comment.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}