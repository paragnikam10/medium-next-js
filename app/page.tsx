"use client"

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGetStarted = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-100">
     
      <nav className="bg-purple-100 border-b border-black px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
     
          <h1 className="text-3xl md:text-4xl font-bold font-charter">Medium</h1>

          <div className="hidden md:flex space-x-6 font-serif">
            <a href="#" className="text-black hover:underline">Our story</a>
            <a href="#" className="hover:underline">Membership</a>
            <a href="/signup" className="hover:underline">Write</a>
            <a href="/signin" className="hover:underline">Sign in</a>
            <button onClick={handleGetStarted} className="bg-black text-white py-2 px-4 rounded-full">Get started</button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col items-center mt-4 space-y-4 font-serif text-lg">
            <a href="#" className="text-black" onClick={() => setMenuOpen(false)}>Our story</a>
            <a href="#" onClick={() => setMenuOpen(false)}>Membership</a>
            <a href="/signup" onClick={() => setMenuOpen(false)}>Write</a>
            <a href="/signin" onClick={() => setMenuOpen(false)}>Sign in</a>
            <button onClick={handleGetStarted} className="bg-black text-white py-2 px-6 rounded-full">Get started</button>
          </div>
        )}
      </nav>

      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 md:px-12 max-w-7xl mx-auto space-y-8 md:space-y-0 md:space-x-12">
       
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold font-charter">Human stories & ideas</h1>
          <p className="text-lg text-gray-700 mt-4">A place to read, write, and deepen your understanding</p>
          <button onClick={handleGetStarted} className="mt-6 bg-black text-white rounded-full py-3 px-8 text-lg">Start reading</button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            alt="main image"
            src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
            width={800}
            height={592}
            className="w-full h-auto max-w-md md:max-w-xl object-contain"
          />
        </div>
      </div>

      <footer className="border-t border-black py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between px-6 text-gray-500 text-sm font-serif space-y-2 md:space-y-0">
          {['Help', 'Status', 'About', 'Careers', 'Press', 'Blog', 'Privacy', 'Terms', 'Text to speech', 'Teams'].map((item, index) => (
            <a key={index} href="#" className="hover:text-black mx-2 md:mx-4">{item}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

