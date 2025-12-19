import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const headlines = [
  "Automate Your Sales, 10X Your Revenue",
  "AI That Closes Deals While You Sleep",
  "Turn Conversations Into Revenue 24/7",
  "Scale Your Business Without Hiring",
  "Let AI Handle Your Entire Sales Team",
  "Revenue on Autopilot, Growth on Demand",
  "Work Smarter, Earn More, Stress Less"
];

export function TypingHeadline() {
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    const currentHeadline = headlines[currentHeadlineIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        if (displayedText.length < currentHeadline.length) {
          setDisplayedText(currentHeadline.slice(0, displayedText.length + 1));
          setTypingSpeed(80 + Math.random() * 40);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentHeadline.slice(0, displayedText.length - 1));
          setTypingSpeed(40);
        } else {
          setIsDeleting(false);
          setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentHeadlineIndex, typingSpeed]);

  return (
    <div className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-tight min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] flex items-center justify-center">
      <span
        style={{
          background: 'linear-gradient(90deg, #ff6b9d 0%, #ffa69e 20%, #ffd97d 40%, #f9ed69 60%, #c9f0ff 80%, #a1c4fd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.02em',
          fontFamily: 'Inter, Montserrat, sans-serif'
        }}
      >
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-pink-500"
        >
          |
        </motion.span>
      </span>
    </div>
  );
}
