import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function ValentineRequest() {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [noClickCount, setNoClickCount] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (isAccepted) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isAccepted]);

  const moveNoButton = () => {
    if (noClickCount >= 8) {
      setNoButtonPos({ x: 0, y: 0 });
      return;
    }
    const randomX = (Math.random() - 0.5) * 400;
    const randomY = (Math.random() - 0.5) * 400;

    setNoButtonPos({ x: randomX, y: randomY });
    setNoClickCount((prev) => prev + 1);
    setYesButtonSize((prev) => (prev < 3 ? prev + 0.4 : prev));
  };

  if (isAccepted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pink-50 text-center p-4 overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1.2, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="text-9xl mb-8"
        >
          🥳
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold text-pink-600 font-serif"
        >
          Best Decision Ever! 💍
        </motion.h1>
        <p className="mt-6 text-2xl text-pink-400 font-light">
          I love you, Maggie! ❤️
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50 overflow-hidden relative p-4">
      <div className="text-6xl mb-8 animate-bounce">
        {yesButtonSize > 2 ? "🥺" : "💝"}
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-16 text-center z-0 font-serif">
        Maggie, Will you be my Valentine?
      </h1>

      <div className="flex items-center justify-center gap-8 relative min-h-[200px] w-full">
        <motion.button
          style={{ scale: yesButtonSize }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-2xl z-50 transition-colors"
          onClick={() => setIsAccepted(true)}
        >
          Yes!
        </motion.button>

        <motion.button
          layout
          animate={{
            x: noButtonPos.x,
            y: noButtonPos.y,
            opacity: noClickCount >= 8 ? 0.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseEnter={moveNoButton}
          className={`bg-red-500 text-white font-bold py-4 px-10 rounded-full shadow-lg ${
            noClickCount >= 8 ? "z-10" : "z-40"
          }`}
        >
          No
        </motion.button>
      </div>
    </div>
  );
}
