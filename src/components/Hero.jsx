import { ArrowRight, Book, PenTool, Coffee, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import BlogCard from "./BlogCard";

export default function Hero() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Real-time fetch from Firestore
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
                const snap = await getDocs(q);
                setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const categories = [
        {
            icon: <Book size={32} />,
            title: "Tech & Programming",
            description: "Insights on software development, new technologies, and coding practices"
        },
        {
            icon: <PenTool size={32} />,
            title: "Creative Writing",
            description: "Personal essays, stories, and reflections on various topics"
        },
        {
            icon: <Coffee size={32} />,
            title: "Lifestyle & Thoughts",
            description: "Daily experiences, personal growth, and life observations"
        },
        {
            icon: <Heart size={32} />,
            title: "Passion Projects",
            description: "Exploring hobbies, interests, and creative endeavors"
        }
    ];

    return (
        <section className="min-h-screen bg-bg text-neutral-100">
            {/* ========= HERO TOP ========= */}
            <div className="relative overflow-hidden bg-gradient-hero">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
                        Welcome to{" "}
                        <span className="text-gradient-brand">Recursive Mind</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-neutral-300 leading-relaxed">
                        A personal blog where thoughts unfold and ideas connect.
                        Join me as I explore technology, creativity, and everything in between.
                    </p>
                    <a
                        href="#latest"
                        className="mt-12 inline-flex items-center gap-3 rounded-xl bg-gradient-button px-8 py-4 font-bold text-neutral-900 text-lg shadow-glow hover:scale-105 transition-transform duration-300"
                    >
                        Read Latest Posts <ArrowRight size={24} />
                    </a>
                </div>

                {/* subtle bottom fade */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
            </div>

            {/* ========= CATEGORIES SECTION ========= */}
            <div className="py-20 bg-neutral-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-neutral-100 mb-4">
                            Explore Different Topics
                        </h2>
                        <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                            From tech insights to personal musings, discover a variety of content
                            that reflects diverse interests and perspectives.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="text-center p-6 bg-surface rounded-xl hover:shadow-glow transition-all duration-300"
                            >
                                <div className="flex justify-center mb-4 text-primary-400">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                                    {category.title}
                                </h3>
                                <p className="text-neutral-300 text-sm">
                                    {category.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========= LATEST POSTS ========= */}
            <div id="latest" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-neutral-100 mb-4">
                        Latest Articles
                    </h2>
                    <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                        Fresh perspectives and recent writings on various topics that capture my current interests.
                    </p>
                </div>

                {loading && (
                    <div className="text-center text-neutral-400 py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
                        <p className="mt-6 text-lg">Loading content…</p>
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center text-neutral-400 py-20">
                        <p className="text-xl mb-2">No posts yet.</p>
                        <p className="text-neutral-300">Check back soon for new content!</p>
                    </div>
                )}

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                {posts.length > 0 && (
                    <div className="text-center mt-16">
                        <p className="text-neutral-300 text-lg">
                            More thoughts and ideas coming soon…
                        </p>
                    </div>
                )}
            </div>

            {/* ========= MY JOURNEY SECTION (Replacement for "About This Blog") ========= */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        My Journey in Code & Creativity
                    </h2>
                    <p className="text-neutral-300 text-lg leading-relaxed mb-8">
                        As a computer science student, I’ve always been fascinated by how logic and creativity can coexist.
                        This blog is my way of documenting that journey — from debugging late-night code to writing about life’s little moments.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <div className="p-6 bg-surface rounded-xl">
                            <div className="w-12 h-12 mx-auto bg-gradient-button text-neutral-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Learn</h3>
                            <p className="text-neutral-400 text-sm">
                                Every post starts with curiosity. I research, experiment, and document what I learn.
                            </p>
                        </div>

                        <div className="p-6 bg-surface rounded-xl">
                            <div className="w-12 h-12 mx-auto bg-gradient-button text-neutral-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Write</h3>
                            <p className="text-neutral-400 text-sm">
                                Writing helps me reflect and clarify my thoughts. It’s coding for the mind.
                            </p>
                        </div>

                        <div className="p-6 bg-surface rounded-xl">
                            <div className="w-12 h-12 mx-auto bg-gradient-button text-neutral-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Share</h3>
                            <p className="text-neutral-400 text-sm">
                                Sharing knowledge builds connection. If my journey helps you, even a little, it’s worth it.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 bg-opacity-40 bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                        <p className="text-neutral-200 italic">
                            “The best way to predict the future is to create it.” – Peter Drucker
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}