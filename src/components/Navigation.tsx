"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/technology", label: "Technology" },
    { href: "/product", label: "Product" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center transition-all duration-300 ${scrolled ? "glass-nav" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">

        <Link href="/" className="flex items-center group shrink-0">
          <Image
            src="/neuralsky-logo.png"
            alt="NeuralSky"
            width={140}
            height={40}
            className="h-9 w-auto object-contain object-left transition-opacity group-hover:opacity-90"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
            <Link key={l.href} href={l.href}
              className={`text-sm font-medium transition-colors relative group ${active ? "text-white" : "text-neutral-400 hover:text-white"}`}
            >
              {l.label}
              <span className={`absolute -bottom-0.5 left-0 h-px bg-[#FF5500] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>
          );})}
        </nav>

        <div className="hidden md:block">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="btn-orange px-5 py-2 text-xs tracking-wider">
            REQUEST ACCESS
          </motion.button>
        </div>

        <button onClick={() => setMenu(!menu)} className="md:hidden p-2 flex flex-col gap-1.5" aria-label="menu">
          <span className={`block w-5 h-0.5 bg-white transition-all ${menu ? "rotate-45 translate-y-2" : ""}`}/>
          <span className={`block w-5 h-0.5 bg-white transition-all ${menu ? "opacity-0" : ""}`}/>
          <span className={`block w-5 h-0.5 bg-white transition-all ${menu ? "-rotate-45 -translate-y-2" : ""}`}/>
        </button>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="absolute top-16 inset-x-0 glass-nav overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMenu(false)}
                  className="py-2 text-sm text-neutral-300 border-b border-white/5">
                  {l.label}
                </Link>
              ))}
              <button className="btn-orange mt-2 py-3 text-xs tracking-wider">REQUEST ACCESS</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
