import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import toast from "react-hot-toast";
import { ArrowLeft, Image, Type, FileText, Link, Upload } from "lucide-react";

export default function AdminCreate() {
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [cover, setCover] = useState("");
    const [body, setBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageOption, setImageOption] = useState("link"); // "link" or "upload"
    const navigate = useNavigate();

    if (!localStorage.getItem("admin")) {
        navigate("/admin-login");
        return null;
    }

    const publish = async (e) => {
        e.preventDefault();

        if (!title.trim() || !excerpt.trim() || !body.trim()) {
            toast.error("Title, excerpt, and content are required");
            return;
        }

        if (imageOption === "link" && !cover.trim()) {
            toast.error("Please provide an image URL");
            return;
        }

        // For upload option, we'd handle file upload here
        // Currently using placeholder since we don't have Storage setup
        let finalCover = cover;
        if (imageOption === "upload" && !cover) {
            toast.error("Please upload an image");
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "posts"), {
                title: title.trim(),
                excerpt: excerpt.trim(),
                cover: finalCover,
                body: body.trim(),
                likes: 0,
                comments: [],
                createdAt: serverTimestamp(),
            });
            toast.success("Post published successfully!");
            navigate("/admin-dashboard");
        } catch (error) {
            console.error("Error publishing post:", error);
            toast.error("Failed to publish post");
        } finally {
            setIsSubmitting(false);
        }
    };

    const generatePlaceholderImage = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        setCover(`https://picsum.photos/seed/${randomSeed}/800/400`);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // For now, we'll use a placeholder since Storage isn't enabled
            toast("File upload selected. Using placeholder since Storage is not enabled.");
            generatePlaceholderImage();

            // When you enable Storage, you would:
            // 1. Upload file to Firebase Storage
            // 2. Get download URL
            // 3. Set cover to that URL
        }
    };

    return (
        <div className="min-h-screen bg-bg text-neutral-100 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate("/admin-dashboard")}
                        className="flex items-center gap-2 text-neutral-300 hover:text-primary-400 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gradient-brand">Create New Post</h1>
                    <div className="w-20"></div>
                </div>

                <form onSubmit={publish} className="space-y-8">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-semibold text-neutral-100 mb-3">
                            <Type size={20} />
                            Title *
                        </label>
                        <input
                            placeholder="Enter post title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-surface-elevated border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-semibold text-neutral-100 mb-3">
                            <FileText size={20} />
                            Excerpt *
                        </label>
                        <textarea
                            placeholder="Brief description of your post"
                            rows={3}
                            value={excerpt}
                            onChange={e => setExcerpt(e.target.value)}
                            className="w-full bg-surface-elevated border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            required
                        />
                    </div>

                    {/* Cover Image Options */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-semibold text-neutral-100 mb-3">
                            <Image size={20} />
                            Cover Image *
                        </label>

                        {/* Option Tabs */}
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setImageOption("link")}
                                className={`px-4 py-2 rounded-lg border transition-colors ${
                                    imageOption === "link"
                                        ? "border-primary-500 bg-primary-500/20 text-primary-400"
                                        : "border-neutral-800 text-neutral-300 hover:border-neutral-600"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Link size={16} />
                                    Use Image URL
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setImageOption("upload")}
                                className={`px-4 py-2 rounded-lg border transition-colors ${
                                    imageOption === "upload"
                                        ? "border-primary-500 bg-primary-500/20 text-primary-400"
                                        : "border-neutral-800 text-neutral-300 hover:border-neutral-600"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Upload size={16} />
                                    Upload Image
                                </div>
                            </button>
                        </div>

                        {/* Link Option */}
                        {imageOption === "link" && (
                            <div className="space-y-3">
                                <div className="flex gap-4">
                                    <input
                                        placeholder="Paste image URL here"
                                        value={cover}
                                        onChange={e => setCover(e.target.value)}
                                        className="flex-1 bg-surface-elevated border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required={imageOption === "link"}
                                    />
                                    <button
                                        type="button"
                                        onClick={generatePlaceholderImage}
                                        className="bg-surface-elevated px-4 py-3 rounded-lg border border-neutral-800 hover:bg-primary-500/20 transition-colors whitespace-nowrap"
                                    >
                                        Generate Placeholder
                                    </button>
                                </div>
                                {cover && (
                                    <div className="mt-2">
                                        <img
                                            src={cover}
                                            alt="Cover preview"
                                            className="max-w-xs rounded-lg border border-surface-elevated"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Upload Option */}
                        {imageOption === "upload" && (
                            <div className="space-y-3">
                                <label className="block p-6 border-2 border-dashed border-neutral-700 rounded-lg text-center cursor-pointer hover:border-primary-500 transition-colors">
                                    <Upload size={32} className="mx-auto mb-3 text-neutral-400" />
                                    <p className="text-neutral-300 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-sm text-neutral-400">JPG, PNG, GIF (max 5MB)</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>
                                {cover && (
                                    <div className="mt-2">
                                        <img
                                            src={cover}
                                            alt="Cover preview"
                                            className="max-w-xs rounded-lg border border-surface-elevated"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-semibold text-neutral-100 mb-3">
                            <FileText size={20} />
                            Content *
                        </label>
                        <textarea
                            placeholder="Write your post content here..."
                            rows={12}
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            className="w-full bg-surface-elevated border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6 border-t border-surface-elevated">
                        <button
                            type="button"
                            onClick={() => navigate("/admin-dashboard")}
                            className="px-6 py-3 border border-neutral-800 rounded-lg text-neutral-300 hover:bg-surface-elevated transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-button text-neutral-900 font-semibold px-6 py-3 rounded-lg shadow-glow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-900"></div>
                                    Publishing...
                                </div>
                            ) : (
                                "Publish Post"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}