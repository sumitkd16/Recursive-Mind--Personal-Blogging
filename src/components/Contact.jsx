import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
    const form = useRef();
    const [isSent, setIsSent] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                form.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
            .then(
                () => {
                    setIsSent(true);
                    form.current.reset();
                    toast.success("Message sent successfully! ✅", {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "dark",
                    });
                },
                (error) => {
                    console.error("Error sending message:", error);
                    toast.error("Failed to send message. Please try again.", {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "dark",
                    });
                }
            );
    };

    return (
        <section
            id="contact"
            className="py-16 px-4 sm:px-6 lg:px-8"
        >
            {/* Toast Container */}
            <ToastContainer />

            {/* Section Title */}
            <div className="text-center mb-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-white">Let's Connect</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#06A86C] to-[#0FD186] mx-auto mt-3"></div>
                <p className="text-neutral-300 mt-4 text-sm sm:text-base">
                    Have a question, idea, or opportunity? I’d love to hear from you.
                </p>
            </div>

            {/* Contact Form */}
            <div className="max-w-md mx-auto bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-neutral-700 shadow-lg">
                <form ref={form} onSubmit={sendEmail} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            name="user_email"
                            placeholder="Email Address"
                            required
                            className="w-full px-4 py-3 bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06A86C] focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            name="user_name"
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-3 bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06A86C] focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            required
                            className="w-full px-4 py-3 bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06A86C] focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <textarea
                            name="message"
                            placeholder="Your message..."
                            rows="4"
                            required
                            className="w-full px-4 py-3 bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06A86C] focus:border-transparent transition-all duration-200 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-button text-white font-medium rounded-lg shadow-md hover:from-[#05945e] hover:to-[#0dc07a] hover:scale-[1.01] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#06A86C] focus:ring-offset-2 focus:ring-offset-neutral-900"
                    >
                        Send Message
                    </button>
                </form>

                {/* Success Message */}
                {isSent && (
                    <p className="text-[#06A86C] text-sm text-center mt-4 animate-fade-in">
                        ✅ Thanks for reaching out! I'll get back to you soon.
                    </p>
                )}
            </div>
        </section>
    );
};

export default Contact;