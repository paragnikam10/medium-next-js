"use client"


import axios from "axios";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react"
import { FiBell, FiCopy, FiFacebook, FiLinkedin, FiMoreHorizontal, FiTwitter, FiX } from "react-icons/fi";
import 'react-quill/dist/quill.snow.css';



const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })


export default function Writeblog() {
    const searchParams = useSearchParams();
    const profileImage = searchParams.get("profileImage")

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showModal, setShowModal] = useState(false)
    const { data: session } = useSession();
    const router = useRouter()


    const handlePublish = async () => {
        console.log(session);
        if (!session) {
            console.error("No active session found")
            return
        }

        const userId = session?.user.id
        console.log("user id from publish button", userId)


        try {
            const response = await axios.post("http://localhost:3000/api/blogs/saveblog", {
                title,
                content,
                userId
            })
            console.log("response", response)
            if (response.status >= 200 && response.status < 300) {
                console.log("Blog saved successfully")
                alert("Blog saved successfully")

            } else {
                console.error("Failed to save blog", response.status)

            }
            setShowModal(true);
        } catch (error) {
            console.error("Error saving blog", error)
            alert("Failed to save blog")

        }

    }

    const handleClose = () => {
        router.push("/dashboard");
    }

    return (
        <div className="min-h-screen">

            <nav className="">
                <div className=" max-w-7xl mx-auto px-4 h-14 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-baseline ml-11">
                        <a href="/dashboard" className="text-4xl font-charter font-bold tracking-tighter">Medium</a>
                        <span className="ml-3">Draft in {session?.user.name}</span>
                    </div>

                    <div className="flex items-center space-x-5">
                        <button className="bg-green-700 rounded-full text-sm py-0.5 text-center px-1.5 font-semibold text-white"
                            onClick={handlePublish}

                        >Publish</button>
                        <FiBell className="w-5 h-5" />
                        {profileImage && (
                            <img
                                src={profileImage}
                                alt="Profile Image"
                                className="w-8 h-8 rounded-full"

                            />
                        )}
                    </div>

                </div>
            </nav>

            <div className="min-h-screen">
                <div className="w-full max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
                    <input
                        className="w-full p-4 text-5xl font-serif text-gray-800 focus:outline-none mb-4"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <ReactQuill
                        className="bg-white  p-4 custom-quill "
                        placeholder="Tell your story...."
                        value={content}
                        onChange={setContent}

                    />



                    {showModal && (
                        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-100">
                            <div className="bg-white flex flex-col justify-center items-center shadow-lg w-full max-w-2xl h-auto sm:h-[700px] rounded-lg text-center">
                                <div>
                                    <h1 className="text-5xl font-charter font-semibold">Your story is published!</h1>
                                    <p className="mt-10 font-serif">Share your story with the world</p>
                                </div>

                                <div className="w-full mt-4 space-y-4 text-center">
                                    <button
                                        className=" flex justify-center items-center  font-serif mx-auto w-1/2  py-2 px-4 rounded-full border border-black ">
                                        <FiFacebook className="text-blue-500 text-xl  " />
                                        <span className="flex-grow text-center">Share on facebook</span>
                                    </button>
                                    <button className="flex justify-center items-center text-center font-serif mx-auto  w-1/2 py-2 px-4  rounded-full border border-black">
                                        <FiX className="text-xl  " />
                                        <span className="flex-grow text-center">Share on X</span>
                                    </button>
                                    <button className="flex justify-center items-center font-serif mx-auto w-1/2 py-2 px-4 rounded-full border border-black">
                                        <FiLinkedin className=" text-xl  " />
                                        <span className="flex-grow text-center">Share on Linkedin</span>
                                    </button>
                                    <button className="flex justify-center items-center mx-auto font-serif w-1/2 py-2 px-4 rounded-full border border-black">
                                        <FiCopy className=" text-xl  " />
                                        <span className="flex-grow text-center">Copy link</span>
                                    </button>
                                    <button
                                        className="flex justify-center items-center text-center mx-auto  font-serif w-1/2 py-2 px-4 rounded-full border border-black"
                                        onClick={handleClose}
                                    >Close</button>
                                </div>

                            </div>
                        </div>
                    )}

                </div>






            </div>
        </div>
    )
}