import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollTypewriterProps {
  text: string;
  className?: string;
  highlightClassName?: string;
}

const ScrollTypewriter = ({
  text,
  className = "",
  highlightClassName = "gradient-text",
}: ScrollTypewriterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  const [displayedChars, setDisplayedChars] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const chars = Math.floor(latest * text.length);
      setDisplayedChars(chars);
    });

    return () => unsubscribe();
  }, [scrollYProgress, text.length]);

  return (
    <div ref={containerRef} className={`min-h-[20vh] flex items-center justify-center ${className}`}>
      <motion.p className="text-3xl md:text-5xl font-bold text-center max-w-4xl mx-auto px-4">
        <span className={highlightClassName}>
          {text.slice(0, displayedChars)}
        </span>
        <span className="text-muted-foreground/30">
          {text.slice(displayedChars)}
        </span>
        {displayedChars < text.length && displayedChars > 0 && (
          <motion.span
            className="inline-block w-[3px] h-[1em] bg-primary ml-1"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </motion.p>
    </div>
  );
};

export default ScrollTypewriter;
