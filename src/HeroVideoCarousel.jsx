import React, { useState, useEffect, useRef } from "react";
import "./HeroVideoCarousel.css";
import VideoModal from "./VideoModal";

const SLIDES = [
  { id: 1, title: "PLATFORM OVERVIEW", duration: "01:24", src: "/videos/video1.mp4" },
  { id: 2, title: "FLEET TRACKING", duration: "00:45", src: "/videos/video2.mp4" },
  { id: 3, title: "AUTOMATED SAFETY", duration: "02:10", src: "/videos/video3.mp4" },
  { id: 4, title: "DATA ANALYTICS", duration: "01:55", src: "/videos/video4.mp4" }
];

export default function HeroVideoCarousel() {
  const [active, setActive] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
  };

  useEffect(() => {
    // Only auto-rotate if the modal is not open and carousel is not minimized
    if (!selectedVideo && !isMinimized) {
      resetTimer();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [selectedVideo, isMinimized]);
  const handleCardClick = (index) => {
    if (index !== active) {
      setActive(index);
      resetTimer();
    }
  };

  if (isMinimized) {
    return (
      <div className="hvc-container minimized">
        <button
          className="hvc-restore-btn"
          onClick={() => setIsMinimized(false)}
          aria-label="Restore Video Gallery"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          <span>VIEW GALLERY</span>
        </button>
      </div>
    );
  }

  return (
    <div className="hvc-container">
      <button
        className="hvc-minimize-btn"
        onClick={() => setIsMinimized(true)}
        aria-label="Minimize Gallery"
        title="Minimize"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14h6v6M20 10h-6V4M10 14l-7 7M14 10l7-7" />
        </svg>
      </button>

      <div className="hvc-gallery">
        {SLIDES.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={slide.id}
              className={`hvc-card ${isActive ? "active" : ""}`}
              onClick={() => handleCardClick(i)}
              role="button"
              aria-label={`View ${slide.title}`}
              tabIndex={0}
            >
              <div className="hvc-card-inner">
                {/* Background Video */}
                <video
                  className="hvc-video-bg"
                  src={slide.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Gradient overlay for text readability */}
                <div className="hvc-gradient-overlay" />

                {/* Minimalist Play Button (Visible only on active card) */}
                {isActive && (
                  <button
                    className="hvc-play-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(slide);
                    }}
                    aria-label="Play Full Video"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  </button>
                )}

                {/* Card Content */}
                <div className="hvc-info">
                  {isActive ? (
                    <>
                      <h3 className="hvc-title">{slide.title}</h3>
                      <span className="hvc-duration">{slide.duration}</span>
                    </>
                  ) : (
                    <h3 className="hvc-vertical-title">{slide.title}</h3>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-screen Video Modal */}
      {selectedVideo && (
        <VideoModal
          videoSrc={selectedVideo.src}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
