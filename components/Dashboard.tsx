"use client"

import { signOut, useSession } from "next-auth/react"
import { FiBell, FiEdit, FiHeart, FiMessageCircle, FiUser, FiMinusCircle, FiBookmark, FiMoreHorizontal } from "react-icons/fi"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Topics from "./Topics";
import axios from "axios";
import DOMPurify from 'dompurify';
import Image from "next/image";

interface Author {
    name: string
}

interface BLog {
    id: string,
    title: string,
    content: string,
    createdAt: string,
    author: Author
}

export default function Dashboard({ profileImg }: { profileImg: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState("https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg")
    const [blogs, setBlogs] = useState<BLog[]>([]);

    const writeNewBlog = () => {
        router.push(`/writeblog?profileImage=${encodeURIComponent(profileImage)}`);
    }

    useEffect(() => {
        console.log("User profile image from session:", session?.user.image);

        if (profileImg) {
            setProfileImage(profileImg);
        } else if (session?.user.image) {
            setProfileImage(session.user.image);
        }

        console.log("Fetching blogs...");
        blogList();
    }, [profileImg, session?.user.image]);

    const blogList = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/blogs/blog");
            setBlogs(response.data)
            console.log(response.data.length)
        } catch (error) {
            console.error("Error fetching blogs", error)
        }
    }

    const handleLogout = () => {
        signOut({ callbackUrl: "/signin" });
    }

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-white border border-b-gray-200 w-full">
                <div className=" px-4 sm:px-6 lg:px-8  ">
                    <div className=" flex justify-between items-center h-14">
                        <div className="flex items-center ">
                            <h1 className="text-4xl font-charter font-bold tracking-tighter">Medium</h1>
                            <div className="relative ml-4">
                                <svg
                                    className="w-5 h-5 top-1/2 left-3 text-gray-400 absolute transform -translate-y-1/2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16zm0 0l4.35 4.35"></path>
                                </svg>
                                <input
                                    className="pl-10 pr-4 py-2 rounded-full  outline-none bg-gray-50"
                                    type="text"
                                    placeholder="search"
                                />
                            </div>

                        </div>

                        <div className="flex items-center space-x-10">
                            <button className="flex items-center space-x-1">
                                <FiEdit className="w-6 h-6 text-gray-500 mr-1 font-serif" />
                                <span onClick={writeNewBlog} className="text-gray-500"> Write</span>
                            </button>
                            <button>
                                <FiBell className="w-6 h-6 text-gray-500" />
                            </button>

                            <div className="relative">
                                <Image
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    src={profileImage}
                                    alt="Profile Picture"
                                    className="w-8 h-8 rounded-full"
                                />

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={handleLogout}
                                        >Log Out</button>
                                    </div>
                                )}
                            </div>


                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-grow justify-center items-start  ">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between ">
                    <div className=" w-4/5 p-4 ">

                        <div >
                            {blogs.map((blog) => {
                                const cleanHTML = DOMPurify.sanitize(blog.content);
                                const plainText = cleanHTML.replace(/<[^>]+>/g, '');
                                const previewText = plainText.slice(0, 100)
                                return (
                                    <div key={blog.id}>
                                        <div className="flex items-center mb-4 mt-4 ml-2 ">
                                            <FiUser className="w-5 h-5" />
                                            <span className="font-serif ml-2 text-sm">{blog.author.name}</span>
                                        </div>

                                        <div>
                                            <h1 className="font-charter font-bold text-4xl tracking-tighter ml-2">{blog.title}</h1>
                                            <p className="font-charter ml-2 text-gray-600">{previewText}...</p>
                                        </div>

                                        <div className="flex justify-between items-center mt-4 mb-4">
                                            <div className="flex items-center space-x-6 ml-2">
                                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                                <FiHeart />
                                                <FiMessageCircle />
                                            </div>
                                            <div className="flex items-center space-x-6 mr-2">
                                                <FiMinusCircle />
                                                <FiBookmark />
                                                <FiMoreHorizontal />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-2/5 space-y-6  ">
                        <div className="">
                            <h3 className="p-4 text-xl font-charter font-bold">Staff picks</h3>
                            <ul>
                                <div className="p-4" >
                                    <div className="flex items-center">
                                        <FiUser className="w-5 h-5" />
                                        <span className="font-serif ml-2 text-sm">Parag Nikam</span>
                                    </div>

                                    <h2 className="font-charter font-bold text-xl tracking-tighter mt-2">Life after Spotify: what no one tells you about life after layoffs</h2>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center">
                                        <FiUser className="w-5 h-5" />
                                        <span className="font-serif ml-2 text-sm">Makarand Raut</span>
                                    </div>
                                    <h2 className="font-charter font-bold text-xl tracking-tighter mt-2">You are Using ChatGPT Wrong! — #1 Mistake 99% of Users Make</h2>

                                </div>

                                <div className="p-4">
                                    <div className="flex items-center">
                                        <FiUser className="w-5 h-5" />
                                        <span className="font-serif ml-2 text-sm">Pankaj Jadhav</span>
                                    </div>
                                    <h2 className="font-charter font-bold text-xl tracking-tighter mt-2">7 Simple Button Design Tips That Make a Big Impact</h2>
                                </div>

                            </ul>
                        </div>
                        <div>
                            <Topics />
                        </div>
                    </div>

                </div>
            </div>

        </div>

    )
}