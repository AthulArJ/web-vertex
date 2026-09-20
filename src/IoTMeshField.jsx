import { useEffect, useRef } from "react";

export default function IoTMeshField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width, height;
    let particles = [];
    let animationFrameId;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // FIX: Hard cap particles to 120 to prevent extreme lag on 4K/high-res screens
      const particleCount = Math.min(120, Math.floor((width * height) / 12000));
      particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 1,
          baseRadius: Math.random() * 2 + 1,
          pulseSpeed: Math.random() * 0.05 + 0.02,
          pulse: Math.random() * Math.PI * 2,
          color: Math.random() > 0.8 ? "#FF4500" : "#00F0FF",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Calculate opacity based on distance
            const opacity = 1 - (dist / 150);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls smoothly
        if (p.x <= 0) { p.x = 0; p.vx *= -1; }
        else if (p.x >= width) { p.x = width; p.vx *= -1; }
        
        if (p.y <= 0) { p.y = 0; p.vy *= -1; }
        else if (p.y >= height) { p.y = height; p.vy *= -1; }

        // Pulse effect
        p.pulse += p.pulseSpeed;
        p.radius = Math.max(0.1, p.baseRadius + Math.sin(p.pulse) * 1.5);

        // Draw node glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.radius * 2.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color === "#00F0FF" ? `rgba(0, 240, 255, 0.15)` : `rgba(255, 69, 0, 0.15)`;
        ctx.fill();

        // Draw node core
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      // FIX: Prevent glitching/flashing on mobile scroll by NOT clearing the particles array.
      // We just update the canvas bounds and let existing particles adapt natively.
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    init();
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "#07090F", // Deep high-tech blueprint dark background
      }}
    />
  );
}
