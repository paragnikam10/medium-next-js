"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleGetStarted = async () => {
    router.push("/signup")
  }

  return (
    <div className="min-h-screen flex flex-col bg-purple-100">
      <nav className="bg-purple-100 border border-b-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <div>
              <h1 className="text-4xl font-charter font-bold tracking-tighter ">Medium</h1>
            </div>
            <div>
              <a href="#" className="text-black mr-5  font-serif">Our story</a>
              <a href="#" className="mr-5 font-serif">Membership</a>
              <a href="/signup" className="mr-5 font-serif">Write</a>
              <a href="/signin" className="mr-5 font-serif">Sign in</a>
              <button onClick={handleGetStarted} className="font-serif text-white bg-black py-2 px-4  rounded-full  ">Get started</button>
            </div>

          </div>
        </div>
      </nav>

      <div className="flex-grow flex  justify-center items-center ">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center ">

          <div className="w-1/2 space-y-10">
            <h1 className="text-8xl font-bold font-charter ">  Human stories & ideas</h1>
            <p className="text-lg text-gray-700 ">A place to read, write, and deepen your understanding</p>
            <button onClick={handleGetStarted} className="font-serif text-white bg-black rounded-full py-3 px-8 text-lg">Start reading</button>
          </div>

          <div className="w-1/2 flex justify-end">
            <Image
              alt="main image"
              src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
              width={800}
              height={592}
              className="w-full h-[592px] max-w-none md:max-w-[calc(100vh-9.1rem)] object-contain"></Image>
          </div>

        </div>
      </div>

      <footer className="h-16   border-t border-black">
        <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-6 text-gray-500 text-sm font-serif">
          <a href="#" className="hover:text-black">Help</a>
          <a href="#" className="hover:text-black"> Status</a>
          <a href="#" className="hover:text-black">About</a>
          <a href="#" className="hover:text-black">Careers</a>
          <a href="#" className="hover:text-black">Press</a>
          <a href="#" className="hover:text-black">Blog</a>
          <a href="#" className="hover:text-black">Privacy</a>
          <a href="#" className="hover:text-black">Terms</a>
          <a href="#" className="hover:text-black">Text to speech</a>
          <a href="#" className="hover:text-black">Teams</a>
        </div>
      </footer>
    </div>
  );
}
