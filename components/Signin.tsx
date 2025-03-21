
"use client"

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react"
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function Signin() {
    const { data: session, status } = useSession();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard")
        }
    }, [status, router])

    const handleSignin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError(null);

        if (!email || !password) {
            return setError("Please fill in all fields")
        }
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/user/signin", {
                email,
                password
            })
            console.log("response", response)
            await signIn("credentials", {
                email,
                password,
                redirect: false
            })
            router.push("/dashboard")

        } catch (error: any) {
            setError("Invalid credentials or server error")
        } finally {
            setIsLoading(false);
        }
    }

    const handleProviderSignin = (provider: string) => {
        signIn(provider);
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-purple-100 backdrop-blur-sm bg-opacity-30 ">
            <form onSubmit={handleSignin} className="bg-white rounded-lg shadow-lg p-8 sm:p-6 md:p-12 w-full h-auto max-w-2xl sm:h-[709px] ">
                <h1 className="text-center font-serif text-4xl mb-4 ">Sign in</h1>
                <p className="text-center font-serif mb-6">Welcome back</p>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <div className="w-full mb-6 font-serif">
                    <label htmlFor="email" className="block text-center mb-2 ">Email</label>
                    <input
                        className=" block w-1/2 mx-auto border border-gray-300 outline-none rounded-full p-2 text-center "
                        type="text"
                        spellCheck="false"
                        name="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className=" w-full mb-6 font-serif ">
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
                <button type="submit" disabled={isLoading} className="block w-1/2 mx-auto mt-6 py-2 px-4 bg-black text-white rounded-full font-serif">
                    {isLoading ? "Signing in..." : "Sign in"}
                </button>
                <p className="text-center font-serif my-6">or</p>

                <div className="mt-6 text-center font-serif">
                    <button type="button"
                        className="flex items-center justify-center w-1/2 mx-auto py-2 px-4 border border-black rounded-full mb-4 font-serif"
                        onClick={() => handleProviderSignin("google")}>
                        <FaGoogle className="text-blue-500 mr-4 text-xl" />
                        Sign in with Google</button>
                    <button type="button"
                        className="flex items-center justify-center w-1/2 mx-auto py-2 px-4 border border-black rounded-full font-serif"
                        onClick={() => handleProviderSignin("github")} >
                        <FaGithub className="text-gray-800 mr-4 text-xl" />
                        Sign in with Github</button>
                </div>

                <div className=" mt-8 text-gray-700 text-center font-serif">
                    <p className="">Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-500 underline hover:text-blue-700">
                            Sign up
                        </Link>

                    </p>
                </div>

            </form>
        </div>
    )
}