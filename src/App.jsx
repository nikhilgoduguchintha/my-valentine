import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROMANTIC_REASONS = [
  "You've been my constant in every storm.",
  "Your smile still makes my day brighter.",
  "You're my favorite kind of trouble.",
  "In a world full of chaos, you are my peace.",
  "Your laughter is my favorite sound in the world but please don't sing",
  "Every moment with you feels like exactly where I'm meant to be.",
  "You've grown with me through everything.",
  "Life with you is the greatest adventure I could ask for.",
  "Because loving you feels like home.",
];

const CHEEKY_REASONS = [
  "I'm basically a limited edition.",
  "I make bad jokes, but I laugh anyway 😂",
  "Free tech support for life.",
  "My cooking skills are elite 🧑🏻‍🍳",
  "I'm the best story teller.",
  "I am your never paid best tutor",
  "You know who truly I am (IYKYK)",
  "I look definitely better than you.",
  "Let's be honest… I'm your best decision.",
];

const SAFE_MARGIN = 100;

function randomVelocity() {
  return (Math.random() * 0.25 + 0.15) * (Math.random() > 0.5 ? 1 : -1);
}

function createInitialEnvelopes(width, height) {
  return Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    x: SAFE_MARGIN + Math.random() * (width - SAFE_MARGIN * 2),
    y: SAFE_MARGIN + Math.random() * (height - SAFE_MARGIN * 2),
    vx: randomVelocity(),
    vy: randomVelocity(),
    opened: false,
    letterOpen: false,
    counted: false,
  }));
}

export default function ValentinesExperience() {
  const containerRef = useRef(null);
  const [envelopes, setEnvelopes] = useState([]);
  const [phase, setPhase] = useState("romantic");
  const [showPrompt, setShowPrompt] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeEnvelopeId, setActiveEnvelopeId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const reasons = phase === "romantic" ? ROMANTIC_REASONS : CHEEKY_REASONS;

  useEffect(() => {
    const rect = containerRef.current.getBoundingClientRect();
    setEnvelopes(createInitialEnvelopes(rect.width, rect.height));
  }, []);

  // Floating physics loop
  useEffect(() => {
    let raf;

    const step = () => {
      setEnvelopes((prev) => {
        const rect = containerRef.current.getBoundingClientRect();
        return prev.map((e) => {
          if (e.letterOpen) return e;

          let nx = e.x + e.vx;
          let ny = e.y + e.vy;
          let vx = e.vx;
          let vy = e.vy;

          if (nx < SAFE_MARGIN || nx > rect.width - SAFE_MARGIN) vx *= -1;
          if (ny < SAFE_MARGIN || ny > rect.height - SAFE_MARGIN) vy *= -1;

          return { ...e, x: nx, y: ny, vx, vy };
        });
      });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const openEnvelope = (id) => {
    if (activeEnvelopeId !== null) return;

    setEnvelopes((prev) => {
      let updated = prev.map((e) => {
        if (activeEnvelopeId !== null && e.id === activeEnvelopeId) {
          return {
            ...e,
            letterOpen: false,
            frozen: false,
            vx: randomVelocity(),
            vy: randomVelocity(),
          };
        }

        if (e.id === id) {
          return {
            ...e,
            letterOpen: true,
            opened: true,
            frozen: true,
            vx: 0,
            vy: 0,
          };
        }

        return e;
      });

      return updated;
    });

    setActiveEnvelopeId(id);
  };
  const closeLetter = (id) => {
    setEnvelopes((prev) => {
      const updated = prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            letterOpen: false,
            counted: true,
            vx: randomVelocity(),
            vy: randomVelocity(),
          };
        }
        return e;
      });

      // compute progress from updated envelopes
      const completed = updated.filter((e) => e.counted).length;
      setProgress(completed);

      if (completed === 9 && phase === "romantic") {
        setTimeout(() => setShowPrompt(true), 600);
      }
      if (completed === 9 && phase === "cheeky") {
        setTimeout(() => setShowFinal(true), 700);
      }

      return updated;
    });

    setActiveEnvelopeId(null);
  };
  const enterFullscreen = () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setIsFullscreen(true);
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const startCheeky = () => {
    const rect = containerRef.current.getBoundingClientRect();
    setPhase("cheeky");
    setShowPrompt(false);
    setProgress(0);
    setEnvelopes(createInitialEnvelopes(rect.width, rect.height));
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={
        phase === "romantic"
          ? {
              backgroundImage: `url('${
                import.meta.env.BASE_URL
              }love_theme.jpg')`,
              backgroundRepeat: "repeat",
              backgroundSize: "400px",
              backgroundPosition: "center",
              fontFamily: "Crimson Pro",
            }
          : {
              background:
                "linear-gradient(to bottom right, #fde68a, #fdba74, #c4b5fd)",
              fontFamily: "Crimson Pro",
            }
      }
    >
      {/* Fullscreen entry overlay */}
      {!isFullscreen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <button
            onClick={enterFullscreen}
            className="px-8 py-4 bg-rose-600 text-white rounded-full text-xl shadow-lg hover:scale-105 transition"
          >
            Enter the experience 💕
          </button>
        </div>
      )}

      {/* Title */}
      <motion.div
        className="absolute top-10 w-full text-center font-bold text-[64px]"
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 14,
          delay: 0.1,
        }}
        style={{
          color: phase === "romantic" ? "#dc2626" : "#e28126",
          fontFamily: "Crimson Pro",
        }}
      >
        {phase === "romantic" ? (
          <>
            9 Years, 9 Reasons <span className="text-red-600">♥</span>
          </>
        ) : (
          "9 Reasons to Love Me 😜"
        )}
      </motion.div>

      {/* Subtitle */}
      <motion.div
        className="absolute top-32 w-full text-center font-semibold text-[28px]"
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 16,
          delay: 0.25,
        }}
        style={{
          color: phase === "romantic" ? "#BE123C " : "#7c2d12",
        }}
      >
        {phase === "romantic"
          ? "Click each envelope to discover why I love you"
          : "Click each envelope to discover why you love me"}
      </motion.div>

      {/* Progress */}
      <motion.div
        className="absolute top-44 w-full text-center text-lg font-medium text-gray-700"
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 18,
          delay: 0.4,
        }}
      >
        {progress} of 9 discovered
      </motion.div>

      {/* Envelopes */}
      {!showFinal &&
        envelopes.map((e) => (
          <motion.div
            key={e.id}
            animate={{ x: e.x, y: e.y }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute"
          >
            <AnimatePresence>
              {!e.letterOpen && (
                <motion.div
                  key="env"
                  onClick={() => openEnvelope(e.id)}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative w-[120px] h-[80px] cursor-pointer"
                  style={{
                    background: `
    linear-gradient(
      145deg,
      #fffdf7 0%,
      #f6f1e6 45%,
      #efe7d6 100%
    )
  `,
                    border: "1px solid rgba(212, 175, 55, 0.35)", // soft gold
                    boxShadow: `
    0 8px 18px rgba(0,0,0,0.18),
    inset 0 1px 0 rgba(255,255,255,0.7)
  `,
                  }}
                >
                  {/* Triangular Flap */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full flex justify-center"
                    animate={{
                      rotateX: e.opened ? 180 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{
                      transformOrigin: "top",
                      perspective: 800,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "60px solid transparent",
                        borderRight: "60px solid transparent",
                        borderTop: "42px solid #e6d3a3",
                        filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.15))",
                      }}
                    />
                  </motion.div>

                  {/* Wax seal */}
                  {!e.opened ? (
                    // Full heart when closed
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "22px",
                          background:
                            "radial-gradient(circle at 30% 30%, #ef4444, #7f1d1d)",
                          transform: "rotate(-45deg)",
                          position: "relative",
                          boxShadow: `
          inset -2px -3px 5px rgba(0,0,0,0.35),
          inset 2px 2px 4px rgba(255,255,255,0.25),
          0 2px 4px rgba(0,0,0,0.25)
        `,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            width: "24px",
                            height: "22px",
                            background:
                              "radial-gradient(circle at 30% 30%, #ef4444, #7f1d1d)",
                            borderRadius: "50%",
                            top: "-12px",
                            left: "0",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            width: "24px",
                            height: "22px",
                            background:
                              "radial-gradient(circle at 30% 30%, #ef4444, #7f1d1d)",
                            borderRadius: "50%",
                            left: "12px",
                            top: "0",
                          }}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    // Bottom half after opening
                    <div
                      className="absolute left-1/2 top-[50%] -translate-x-1/2"
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "10px solid transparent",
                        borderRight: "10px solid transparent",
                        borderTop: "14px solid #B94141",
                        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Letter */}
            <AnimatePresence mode="wait">
              {e.letterOpen && (
                <motion.div
                  key="letter"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeLetter(e.id);
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: -80, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.4, 0.0, 0.2, 1],
                  }}
                  className="absolute top-[40px] -translate-x-1/2 w-[280px] cursor-pointer z-50"
                >
                  <div
                    className="p-6 rounded-lg shadow-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                      border: "1.5px solid rgba(217, 119, 6, 0.3)",
                    }}
                  >
                    <p
                      className="text-center text-base leading-relaxed"
                      style={{
                        fontFamily: "Handlee",
                        color: "#78350f",
                        fontSize: "1.15rem",
                      }}
                    >
                      {reasons[e.id]}
                    </p>

                    <p className="text-center mt-4 text-xs text-amber-700 opacity-60">
                      Click to close
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

      {/* Cheeky Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="bg-gradient-to-br from-amber-50 to-rose-50 p-12 rounded-3xl shadow-2xl text-center max-w-md border-2 border-rose-200"
            >
              <div className="text-6xl mb-6">😏</div>

              <h2
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#be123c",
                }}
              >
                Wanna be cheeky?
              </h2>

              <p
                className="text-lg text-rose-700 mb-8"
                style={{
                  fontFamily: "'Crimson Pro', serif",
                }}
              >
                See 9 reasons why YOU should love ME! 😄
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startCheeky}
                  className="px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
                    color: "white",
                  }}
                >
                  Yes! 😂
                </button>

                <button
                  onClick={() => setShowPrompt(false)}
                  className="px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #fbbf24 0%, #fde68a 100%)",
                    color: "#78350f",
                  }}
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Final romantic ending */}
      <AnimatePresence>
        {showFinal && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="bg-gradient-to-br from-rose-50 to-amber-50 p-12 rounded-3xl shadow-2xl text-center max-w-lg border border-rose-200"
            >
              <div className="text-5xl mb-6">❤️</div>

              <h2
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#be123c",
                }}
              >
                I am still your best decision.!! 😜
              </h2>

              <p
                className="text-lg text-rose-700"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Happy Valentine’s Day
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Crimson+Pro:wght@300;400;600&family=Dancing+Script:wght@400;700&display=swap');
      `}</style>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Handlee&display=swap');
      </style>
    </motion.div>
  );
}
