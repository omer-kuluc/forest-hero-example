import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import './App.css';
import { gsap } from 'gsap';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['Trees', 'Creatures', 'Plants', 'Mushrooms', 'Legends'];

  const drawerRef = useRef(null);
  const menuTl = useRef(null);
  const videoRef = useRef(null);

  // Giriş animasyonu: Flaş çakmasını önlemek için set ile görünürlüğü açıyoruz
  const handleEntranceAnimation = () => {
    const tl = gsap.timeline();

    // Animasyon başlamadan hemen önce görünürlüğü aktif et
    tl.set([".background-video", ".navbar", ".hero-container"], { visibility: "visible" });

    tl.to(".background-video", {
      opacity: 1,
      duration: 1,
      ease: "power2.inOut"
    })
      .to(".navbar", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5")
      .to(".hero-container", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
      }, "-=0.8");
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { });
      }
      // Video cache'ten hızlı yüklenirse onLoadedData kaçabilir, kontrol ediyoruz:
      if (videoRef.current.readyState >= 3) {
        handleEntranceAnimation();
      }
    }
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      menuTl.current = gsap.timeline({ paused: true })
        .to(drawerRef.current, {
          y: 0,
          duration: 0.8,
          ease: "expo.inOut"
        })
        .from(".mobile-nav-links .nav-link", {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.4");
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (isMenuOpen) {
      menuTl.current.play();
    } else {
      menuTl.current.reverse();
    }
  }, [isMenuOpen]);

  return (
    <div className="hero-section">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
        onLoadedData={handleEntranceAnimation}
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4" />
      </video>

      <div className="overlay"></div>

      <header className="navbar">
        <div className="nav-wrapper">
          <p className="nav-logo">Forest</p>
          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="icon-text">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
          <nav className="nav-menu desktop-only">
            {navItems.map((item) => (
              <div key={item} className="nav-link">
                <span>{item}</span>
                <div className="arrow-down" />
              </div>
            ))}
          </nav>
          <div className="nav-action desktop-only">
            <button className="contact-btn">Contact</button>
          </div>
        </div>

        <div
          ref={drawerRef}
          className="mobile-drawer"
          style={{ transform: 'translateY(-100%)' }}
        >
          <nav className="mobile-nav-links">
            {navItems.map((item) => (
              <div key={item} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <span>{item}</span>
              </div>
            ))}
            <button className="contact-btn">Contact</button>
          </nav>
        </div>
      </header>

      <div className="hero-container">
        <p className="hero-subtitle">The Story Behind Trees</p>
        <h1 className="hero-title">Forest Encyclopedia</h1>
      </div>
    </div>
  );
}

export default App;