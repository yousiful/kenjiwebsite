import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const headlines = [
  "Enterprise AI That Drives Measurable Growth",
  "Intelligent Automation for Market Leaders",
  "Scale Operations Without Adding Headcount",
  "Turn Strategic Vision Into Execution",
  "AI-Powered Systems That Deliver Results",
  "Operational Excellence Through Automation",
  "Transform Complexity Into Competitive Advantage"
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
    <div className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight min-h-[120px] sm:min-h-[200px] md:min-h-[250px] lg:min-h-[300px] flex items-center justify-center px-4">
      <span
        className="text-center"
        style={{
          background: 'linear-gradient(90deg, #ff6b9d 0%, #ffa69e 20%, #ffd97d 40%, #f9ed69 60%, #c9f0ff 80%, #a1c4fd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.02em',
          fontFamily: 'Inter, Montserrat, sans-serif',
          wordBreak: 'break-word',
          hyphens: 'auto'
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
