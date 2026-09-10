"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GsapBackground() {
  const containerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const gridLinesRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a GSAP Master Timeline for continuous, fluid ambient background motion
    const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: "sine.inOut" });

    if (orb1Ref.current) {
      tl.to(orb1Ref.current, {
        x: "15vw",
        y: "20vh",
        scale: 1.25,
        rotation: 45,
        duration: 8,
      }, 0);
    }

    if (orb2Ref.current) {
      tl.to(orb2Ref.current, {
        x: "-12vw",
        y: "-15vh",
        scale: 0.85,
        rotation: -60,
        duration: 10,
      }, 0);
    }

    if (orb3Ref.current) {
      tl.to(orb3Ref.current, {
        x: "10vw",
        y: "-25vh",
        scale: 1.15,
        rotation: 90,
        duration: 9,
      }, 0);
    }

    // Pulse grid animation
    if (gridLinesRef.current) {
      gsap.to(gridLinesRef.current, {
        opacity: 0.25,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-60"
    >
      {/* GSAP Animated Floating Glow Orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 left-1/6 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-brand-blue/30 via-indigo-500/20 to-cyan-400/20 blur-[120px]"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-1/4 right-1/6 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-brand-green/20 via-emerald-500/15 to-blue-600/20 blur-[140px]"
      />
      <div
        ref={orb3Ref}
        className="absolute top-2/3 left-1/3 w-[380px] h-[380px] rounded-full bg-gradient-to-r from-purple-600/20 to-pink-500/15 blur-[110px]"
      />

      {/* GSAP Animated Subtle Grid Overlay */}
      <div
        ref={gridLinesRef}
        className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"
      />
    </div>
  );
}
