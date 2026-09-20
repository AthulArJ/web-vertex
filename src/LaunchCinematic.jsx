import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   VERTEX — PREMIUM BRAND SIGNATURE INTRO
   
   Duration: ~1.25s total (maximum 1.5s)
   Sequence:
   1. [0.0s - 0.45s]: VX Logo Mark reveals with smooth scale & soft ember glow
   2. [0.45s - 0.9s]: VERTEX wordmark reveals with refined typography tracking
   3. [0.9s - 1.25s]: Brief brand signature hold
   4. [1.25s - 1.45s]: Smooth fade/transition directly revealing the website
   Zero loading delay, zero complex 3D scenes, instant transition.
------------------------------------------------------------------- */

const LOGO_SRC = "/images/vertex-vx-mark.png";

export default function LaunchCinematic({ onComplete }) {
  const [stage, setStage] = useState("start"); // "start" -> "wordmark" -> "fadeout"

  useEffect(() => {
    // 1. Reveal Wordmark at 450ms
    const timer1 = setTimeout(() => {
      setStage("wordmark");
    }, 450);

    // 2. Start container fadeout at 1150ms
    const timer2 = setTimeout(() => {
      setStage("fadeout");
    }, 1150);

    // 3. Complete intro and reveal website at 1450ms (~1.4s total)
    const timer3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div
      className="vx-brand-intro-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#040507",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: stage === "fadeout" ? 0 : 1,
        transition: "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* Subtle volcanic ambient glow behind the logo */}
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230, 57, 70, 0.12) 0%, rgba(255, 99, 38, 0.04) 45%, transparent 70%)",
          filter: "blur(40px)",
          transform: stage === "start" ? "scale(0.85)" : "scale(1.1)",
          transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
        }}
      />

      {/* Brand Lockup */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "22px",
        }}
      >
        {/* 1. VX Logo Mark */}
        <div
          style={{
            width: "84px",
            height: "84px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: stage === "start" ? 0.2 : 1,
            transform:
              stage === "start"
                ? "scale(0.88) translateY(8px)"
                : "scale(1) translateY(0)",
            transition:
              "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: "drop-shadow(0 8px 24px rgba(230, 57, 70, 0.25))",
          }}
        >
          <img
            src={LOGO_SRC}
            alt="VERTEX"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* 2. VERTEX Wordmark & Industrial Sub-Tag */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: stage === "start" ? 0 : 1,
            transform:
              stage === "start"
                ? "translateY(8px) scale(0.96)"
                : "translateY(0) scale(1)",
            transition:
              "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span
            style={{
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.28em",
              color: "#f5f6f8",
              textTransform: "uppercase",
              paddingLeft: "0.28em", // optical centering with letter-spacing
            }}
          >
            VERTEX
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#e63946",
              textTransform: "uppercase",
              marginTop: "8px",
              paddingLeft: "0.22em",
              opacity: 0.88,
            }}
          >
            INDUSTRIAL AUTOMATION
          </span>
        </div>
      </div>
    </div>
  );
}