"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { FiBell, FiCopy, FiFacebook, FiLinkedin, FiX } from "react-icons/fi";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as unknown as React.FC<any>;

export default function WriteBlog() {
    const searchParams = useSearchParams();
    const profileImage = searchParams.get("profileImage");
    const { data: session } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);

    const handlePublish = useCallback(async () => {
        if (!session) {
            console.error("No active session found");
            return;
        }

        try {
            const response = await axios.post("/api/blogs/saveblog", {
                title,
                content,
                userId: session.user.id,
            });

            if (response.status >= 200 && response.status < 300) {
                alert("Blog saved successfully");
                setShowModal(true);
            } else {
                console.error("Failed to save blog", response.status);
            }
        } catch (error) {
            console.error("Error saving blog", error);
            alert("Failed to save blog");
        }
    }, [title, content, session]);

    const handleClose = () => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
                    <div className="flex items-baseline">
                        <a href="/dashboard" className="text-4xl font-charter font-bold">
                            Medium
                        </a>
                        <span className="ml-3 text-gray-600">Draft in {session?.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-5">
                        <button
                            className="bg-green-700 rounded-full text-sm py-1 px-3 font-semibold text-white hover:bg-green-800 transition"
                            onClick={handlePublish}
                        >
                            Publish
                        </button>
                        <FiBell className="w-5 h-5 text-gray-600" />
                        {profileImage && (
                            <Image
                                src={profileImage}
                                alt="Profile"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                    </div>
                </div>
            </nav>

            <div className="min-h-screen">
                <div className="w-full max-w-5xl mx-auto mt-10 px-4">
                    <input
                        className="w-full p-4 text-5xl font-serif text-gray-800 focus:outline-none mb-4"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <ReactQuill
                        className="bg-white p-4 custom-quill"
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        placeholder="Tell your story..."
                    />
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90">
                    <div className="bg-white shadow-lg w-full max-w-2xl p-8 rounded-lg text-center">
                        <h1 className="text-4xl font-charter font-semibold">
                            Your story is published!
                        </h1>
                        <p className="mt-4 font-serif text-gray-700">
                            Share your story with the world
                        </p>

                        <div className="w-full mt-6 space-y-4">
                            <button className="flex justify-center items-center font-serif w-full py-2 px-4 rounded-full border border-black">
                                <FiFacebook className="text-blue-500 text-xl" />
                                <span className="ml-2">Share on Facebook</span>
                            </button>
                            <button className="flex justify-center items-center font-serif w-full py-2 px-4 rounded-full border border-black">
                                <FiX className="text-xl" />
                                <span className="ml-2">Share on X</span>
                            </button>
                            <button className="flex justify-center items-center font-serif w-full py-2 px-4 rounded-full border border-black">
                                <FiLinkedin className="text-xl" />
                                <span className="ml-2">Share on LinkedIn</span>
                            </button>
                            <button className="flex justify-center items-center font-serif w-full py-2 px-4 rounded-full border border-black">
                                <FiCopy className="text-xl" />
                                <span className="ml-2">Copy link</span>
                            </button>
                            <button
                                className="flex justify-center items-center font-serif w-full py-2 px-4 rounded-full border border-black"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

