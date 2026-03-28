"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [glow, setGlow] = useState({ x: 0, y: 0, on: false });
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

        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#FF5500" }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <circle cx="10" cy="10" r="3" fill="white"/>
              <path d="M10 3v2.5M10 14.5V17M3 10h2.5M14.5 10H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5.3 5.3l1.8 1.8M12.9 12.9l1.8 1.8M5.3 14.7l1.8-1.8M12.9 7.1l1.8-1.8" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
          <span
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setGlow({ x: (e.clientX - r.left - r.width/2) / (r.width/2), y: (e.clientY - r.top - r.height/2) / (r.height/2), on: true });
            }}
            onMouseLeave={() => setGlow({ x: 0, y: 0, on: false })}
            className="font-black tracking-[0.2em] text-sm text-white select-none"
            style={{
              textShadow: glow.on ? `${glow.x*14}px ${glow.y*8}px 22px rgba(255,85,0,0.95), ${glow.x*-8}px ${glow.y*-5}px 30px rgba(255,140,0,0.6)` : "none",
              transform: glow.on ? `perspective(300px) rotateX(${glow.y*-5}deg) rotateY(${glow.x*7}deg) scale(1.04)` : "none",
              transition: "text-shadow 0.1s ease, transform 0.1s ease",
            }}
          >
            NEURALSKY
          </span>
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
