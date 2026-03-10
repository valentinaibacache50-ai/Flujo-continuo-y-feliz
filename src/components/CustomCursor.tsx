import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Don't render on touch-only devices
    if (window.matchMedia("(hover: none)").matches) return;

    const target = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = el?.closest("a, button, input, textarea, select, [role='button'], label");
      setHovering(!!isInteractive);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ringRef.current.x = lerp(ringRef.current.x, target.x, 0.1);
      ringRef.current.y = lerp(ringRef.current.y, target.y, 0.1);
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full bg-white"
        style={{
          width: hovering ? 8 : 6,
          height: hovering ? 8 : 6,
          left: pos.x - (hovering ? 4 : 3),
          top: pos.y - (hovering ? 4 : 3),
          transform: clicking ? "scale(0.4)" : "scale(1)",
          transition: "transform 0.1s ease, width 0.2s ease, height 0.2s ease",
          boxShadow: "0 0 6px rgba(255,255,255,0.6)",
        }}
      />
      {/* Ring */}
      <div
        className="fixed pointer-events-none z-[9998] rounded-full border border-white/40"
        style={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          left: ringPos.x - (hovering ? 22 : 14),
          top: ringPos.y - (hovering ? 22 : 14),
          transform: clicking ? "scale(0.8)" : "scale(1)",
          transition: "transform 0.15s ease, width 0.25s ease, height 0.25s ease, border-color 0.25s ease",
          borderColor: hovering ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
        }}
      />
    </>
  );
};

export default CustomCursor;
