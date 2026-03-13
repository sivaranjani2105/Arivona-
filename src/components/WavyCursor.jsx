import { useEffect, useRef, useState } from "react";

export default function WavyCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    // Use refs for positions to avoid React re-renders on every mouse move
    const mousePos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const reqRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            const el = e.target.closest("button, [data-hover], a, input, select, textarea");
            setIsHovering(!!el);
        };

        window.addEventListener("mousemove", handleMouseMove);

        // native animation loop for 60fps performance without re-renders
        const tick = () => {
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px, 0) scale(${isHovering ? 0 : 1})`;
            }

            if (ringRef.current) {
                // smooth trailing effect via basic lerping
                ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
                ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

                ringRef.current.style.transform = `translate3d(${ringPos.current.x - 24}px, ${ringPos.current.y - 24}px, 0) scale(${isHovering ? 1.3 : 1})`;
            }
            reqRef.current = requestAnimationFrame(tick);
        };
        reqRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(reqRef.current);
        };
    }, [isHovering]);

    return (
        <>
            <style>{`
        * { cursor: none !important; }
        /* Fallback for safety if custom cursor gets hidden */
        @media (max-width: 768px) { * { cursor: auto !important; } }
      `}</style>

            {/* Inner Dot */}
            <div
                ref={dotRef}
                style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: 8, height: 8,
                    backgroundColor: isHovering ? "transparent" : "#A5F3FC",
                    boxShadow: "0 0 10px #22D3EE",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 99999,
                    transition: "background-color 0.2s, transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            />

            {/* Glowing Cyan Ring */}
            <div
                ref={ringRef}
                style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: 48, height: 48,
                    border: `2px solid ${isHovering ? "#A5F3FC" : "#22D3EE"}`,
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 99998,
                    transition: "border-color 0.2s, background-color 0.2s, box-shadow 0.2s",
                    backgroundColor: isHovering ? "rgba(6, 182, 212, 0.1)" : "transparent",
                    boxShadow: isHovering
                        ? "-4px -4px 15px rgba(255,255,255,0.6), 4px 4px 25px rgba(6, 182, 212, 0.9), inset 0 0 20px rgba(6, 182, 212, 0.6)"
                        : "-2px -2px 10px rgba(255,255,255,0.8), 2px 2px 15px rgba(6, 182, 212, 0.8), inset 0 0 10px rgba(6, 182, 212, 0.5)"
                }}
            />
        </>
    );
}
