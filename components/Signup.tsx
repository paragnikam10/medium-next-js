"use client"

import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function Signup() {
    console.log("inside sign up")
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if ( !name || !email || !password || !confirmPassword) {
            return setError("Please fill in all fields")
        }

        if (password !== confirmPassword) {
            return setError("Password do not match")
        }
        setIsLoading(true);
        const defaultProfileImage = "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg";
        try {
            const response = await axios.post("/api/user/signup", {
                name,
                email,
                password,
                profileImage: defaultProfileImage
            })

            if (response.status === 201) {
                await signIn("credentials", {
                    email,
                    password,
                    redirect: false
                });
                router.push("/dashboard");
            } else {
                setError("Unexpected error. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError("Error signing up. Please try again later.")
            
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-purple-100 backdrop-blur-sm bg-opacity-30 ">
            <form onSubmit={handleSignup} className="bg-white rounded-lg shadow-lg p-8 sm:p-6 md:p-12 w-full h-auto max-w-2xl sm:h-[709px] ">
                <h1 className="text-center font-serif text-4xl mb-6 ">Sign up</h1>
                <p className="text-center font-serif mb-8">Create an account to start writing</p>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}


                <div className="w-full mb-4 font-serif">
                    <label htmlFor="text" className="block text-center ">Name</label>
                    <input
                        className=" block w-1/2 mx-auto border border-gray-300 outline-none rounded-full p-2 text-center"
                        type="text"
                        spellCheck="false"
                        name="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="w-full mb-4 font-serif">
                    <label htmlFor="email" className="block text-center ">Email</label>
                    <input
                        className=" block w-1/2 mx-auto border border-gray-300 outline-none rounded-full p-2 text-center"
                        type="email"
                        spellCheck="false"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className=" w-full mb-4 font-serif ">
                    <label htmlFor="password" className="block text-center mb-2 ">Password</label>
                    <input
                        className="block w-1/2 mx-auto border border-gray-300 outline-none p-2 rounded-full text-center"
                        type="password"
                        spellCheck="false"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="w-full mb-6 font-serif">
                    <label htmlFor="confirmPassword" className="block text-center mb-2">Confirm Password</label>
                    <input
                        className="block w-1/2 mx-auto border border-gray-300 outline-none p-2 rounded-full text-center"
                        type="password"
                        spellCheck="false"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={isLoading} className="block w-1/2 mx-auto mt-4 py-2 px-4 bg-black text-white rounded-full font-serif">
                    {isLoading ? "Signing up..." : "Sign up"}
                </button>

                <div className=" mt-8 text-gray-700 text-center font-serif">
                    <p className="">Already have an account? {" "}
                        <Link href="/signin" className="text-blue-500 underline hover:text-blue-700">
                            Sign in
                        </Link>
                    </p>
                </div>

            </form>
        </div>
    )
}