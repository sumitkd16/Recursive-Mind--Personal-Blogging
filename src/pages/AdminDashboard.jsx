import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Edit, Trash2, Plus, ArrowLeft, X, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", excerpt: "", cover: "", body: "" });
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("admin")) {
            navigate("/admin-login");
            return;
        }
        fetchPosts();
    }, [navigate]);

    const fetchPosts = async () => {
        try {
            const snap = await getDocs(collection(db, "posts"));
            setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await deleteDoc(doc(db, "posts", postId));
            toast.success("Post deleted successfully");
            fetchPosts(); // Refresh the list
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setEditForm({
            title: post.title || "",
            excerpt: post.excerpt || "",
            cover: post.cover || "",
            body: post.body || ""
        });
    };

    const handleSaveEdit = async () => {
        if (!editForm.title.trim() || !editForm.excerpt.trim() || !editForm.body.trim()) {
            toast.error("Title, excerpt, and content are required");
            return;
        }

        setIsSaving(true);
        try {
            const postRef = doc(db, "posts", editingPost.id);
            await updateDoc(postRef, {
                title: editForm.title.trim(),
                excerpt: editForm.excerpt.trim(),
                cover: editForm.cover,
                body: editForm.body.trim(),
            });
            toast.success("Post updated successfully!");
            setEditingPost(null);
            fetchPosts(); // Refresh the list
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Failed to update post");
        } finally {
            setIsSaving(false);
        }
    };

    const generatePlaceholderImage = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        setEditForm({...editForm, cover: `https://picsum.photos/seed/${randomSeed}/800/400`});
    };

    if (!localStorage.getItem("admin")) {
        return null;
    }

    return (
        <div className="min-h-screen bg-bg text-neutral-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-neutral-300 hover:text-primary-400 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Site
                        </button>
                        <h1 className="text-3xl font-bold text-gradient-brand">Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={() => navigate("/admin-create")}
                        className="flex items-center gap-2 bg-gradient-button text-neutral-900 font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                    >
                        <Plus size={20} />
                        New Post
                    </button>
                </div>

                {/* Posts List */}
                <div className="bg-surface rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-6">Manage Posts ({posts.length})</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                            <p className="text-neutral-300">Loading posts...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400">
                            <p>No posts yet. Create your first post!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-neutral-800 hover:bg-surface-elevated/70 transition-all duration-200 cursor-pointer group"
                                    onClick={() => navigate(`/blog/${post.id}`)}
                                >
                                    {/* Clickable Area: Post Info */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <img
                                            src={post.cover}
                                            alt={post.title}
                                            className="w-16 h-12 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/64x48/333/666?text=Image";
                                            }}

                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-neutral-100 truncate group-hover:text-primary-400 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-neutral-400">
                                                {new Date(post.createdAt?.toDate()).toLocaleDateString()} •
                                                {post.likes || 0} likes • {post.comments?.length || 0} comments
                                            </p>
                                        </div>
                                    </div>

                                    {}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(post);
                                            }}
                                            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded transition-colors"
                                            title="Edit post"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(post.id, post.title);
                                            }}
                                            className="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                                            title="Delete post"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-surface rounded-xl p-6 text-center">
                        <h3 className="text-2xl font-bold text-primary-400">{posts.length}</h3>
                        <p className="text-neutral-300">Total Posts</p>
                    </div>
                    <div className="bg-surface rounded-xl p-6 text-center">
                        <h3 className="text-2xl font-bold text-accent-400">
                            {posts.reduce((total, post) => total + (post.likes || 0), 0)}
                        </h3>
                        <p className="text-neutral-300">Total Likes</p>
                    </div>
                    <div className="bg-surface rounded-xl p-6 text-center">
                        <h3 className="text-2xl font-bold text-green-400">
                            {posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                        </h3>
                        <p className="text-neutral-300">Total Comments</p>
                    </div>
                </div>

                {/* Edit Modal - UPDATED FOR BETTER VISIBILITY */}
                {editingPost && (
                    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
                        <div className="bg-neutral-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-black">
                            <div className="sticky top-0 bg-neutral-800 p-4 border-b border-neutral-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-neutral-100">Edit Post</h2>
                                <button
                                    onClick={() => setEditingPost(null)}
                                    className="p-1 text-white hover:text-neutral-100 rounded-full hover:bg-neutral-700 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-lg font-semibold text-neutral-100 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        placeholder="Enter post title"
                                        value={editForm.title}
                                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                                        className="w-full bg-black border border-neutral-600 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="block text-lg font-semibold text-neutral-100 mb-2">
                                        Excerpt *
                                    </label>
                                    <textarea
                                        placeholder="Brief description of your post"
                                        rows={3}
                                        value={editForm.excerpt}
                                        onChange={e => setEditForm({...editForm, excerpt: e.target.value})}
                                        className="w-full bg-black border border-black rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                        required
                                    />
                                </div>

                                {/* Cover Image */}
                                <div>
                                    <label className="block text-lg font-semibold text-neutral-100 mb-2">
                                        Cover Image
                                    </label>
                                    <div className="flex gap-4">
                                        <input
                                            placeholder="Paste image URL here"
                                            value={editForm.cover}
                                            onChange={e => setEditForm({...editForm, cover: e.target.value})}
                                            className="flex-1 bg-black border border-neutral-600 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={generatePlaceholderImage}
                                            className="bg-black px-4 py-3 rounded-lg border border-neutral-600 hover:bg-primary-500/20 transition-colors whitespace-nowrap"
                                        >
                                            Generate Placeholder
                                        </button>
                                    </div>
                                    {editForm.cover && (
                                        <div className="mt-3">
                                            <img
                                                src={editForm.cover}
                                                alt="Cover preview"
                                                className="max-w-xs rounded-lg border border-neutral-700"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Body */}
                                <div>
                                    <label className="block text-lg font-semibold text-neutral-100 mb-2">
                                        Content *
                                    </label>
                                    <textarea
                                        placeholder="Write your post content here..."
                                        rows={12}
                                        value={editForm.body}
                                        onChange={e => setEditForm({...editForm, body: e.target.value})}
                                        className="w-full bg-black border border-black rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-neutral-800 p-4 border-t border-neutral-700 flex justify-end gap-4">
                                <button
                                    onClick={() => setEditingPost(null)}
                                    className="px-4 py-2 border border-neutral-600 rounded-lg text-neutral-300 hover:bg-neutral-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 bg-gradient-button text-neutral-900 font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}