import React, { useEffect, useState } from "react";
import "./VideoModal.css";

export default function VideoModal({ videoSrc, title, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Trigger entry animation
    requestAnimationFrame(() => {
      setIsOpen(true);
    });
    
    // Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Wait for exit animation before unmounting
    setTimeout(() => {
      onClose();
    }, 400); 
  };

  return (
    <div className={`video-modal-overlay ${isOpen ? "is-open" : ""}`} onClick={handleClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Futuristic Frame / Brackets */}
        <svg className="vm-bracket tl" viewBox="0 0 20 20"><path d="M0,20 L0,0 L20,0" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        <svg className="vm-bracket tr" viewBox="0 0 20 20"><path d="M0,0 L20,0 L20,20" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        <svg className="vm-bracket bl" viewBox="0 0 20 20"><path d="M20,20 L0,20 L0,0" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        <svg className="vm-bracket br" viewBox="0 0 20 20"><path d="M0,20 L20,20 L20,0" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        
        {/* Header Bar */}
        <div className="vm-header">
          <div className="vm-title-wrap">
            <span className="vm-dot" />
            <span className="vm-title">PLAYBACK: {title}</span>
          </div>
          <button className="vm-close-btn" onClick={handleClose} aria-label="Close Video">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="vm-video-wrapper">
          <video 
            className="vm-video" 
            src={videoSrc} 
            controls 
            autoPlay 
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
