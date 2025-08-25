import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

export default function BlogCard({ post }) {
    // Format date if available
    const formatDate = (timestamp) => {
        if (!timestamp) return "Recent";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Estimate reading time
    const getReadingTime = (text) => {
        const wordsPerMinute = 200;
        const words = text ? text.split(/\s+/).length : 0;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    return (
        <Link
            to={`/blog/${post.id}`}
            className="group bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border border-surface-elevated"
        >
            {/* Cover Image */}
            <div className="relative overflow-hidden h-48">
                <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${post.id}/600/340`;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-100 mb-3 group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-neutral-300 mb-4 line-clamp-3">
                    {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-neutral-400">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{formatDate(post.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{getReadingTime(post.body)}</span>
                    </div>
                </div>

                {/* Interaction Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-elevated text-sm text-neutral-400">
                    <span>{post.likes || 0} likes</span>
                    <span>{post.comments?.length || 0} comments</span>
                </div>
            </div>
        </Link>
    );
}