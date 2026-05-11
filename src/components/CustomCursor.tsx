import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ring = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    setVisible(true);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      const dot = dotRef.current;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isHover = !!el?.closest("a, button, input, textarea, select, [role='button'], label");
      const dotSize = isHover ? 8 : 6;

      if (dot) {
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.left = `${e.clientX - dotSize / 2}px`;
        dot.style.top = `${e.clientY - dotSize / 2}px`;
      }

      const ringEl = ringRef.current;
      if (ringEl) {
        const size = isHover ? 44 : 28;
        ringEl.style.width = `${size}px`;
        ringEl.style.height = `${size}px`;
        ringEl.style.borderColor = isHover ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)";
      }
    };

    const onDown = () => {
      if (dotRef.current) dotRef.current.style.transform = "scale(0.4)";
      if (ringRef.current) ringRef.current.style.transform = "scale(0.8)";
    };
    const onUp = () => {
      if (dotRef.current) dotRef.current.style.transform = "scale(1)";
      if (ringRef.current) ringRef.current.style.transform = "scale(1)";
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, target.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, target.current.y, 0.12);
      const ringEl = ringRef.current;
      if (ringEl) {
        const w = parseFloat(ringEl.style.width) || 28;
        ringEl.style.left = `${ring.current.x - w / 2}px`;
        ringEl.style.top = `${ring.current.y - w / 2}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
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

  if (!visible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] rounded-full bg-white"
        style={{
          width: 6, height: 6, left: -100, top: -100,
          transition: "transform 0.1s ease, width 0.15s ease, height 0.15s ease",
          boxShadow: "0 0 6px rgba(255,255,255,0.6)",
        }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] rounded-full border border-white/40"
        style={{
          width: 28, height: 28, left: -100, top: -100,
          transition: "transform 0.15s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
