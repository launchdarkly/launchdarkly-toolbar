import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as styles from './Tooltip.module.css';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isPositioned, setIsPositioned] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const updatePosition = React.useCallback(() => {
    if (containerRef.current && tooltipRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - rect.height / 2 - 16,
        left: rect.left + rect.width / 2 - tooltipRect.width / 2 - 4,
      });
      setIsPositioned(true);
    }
  }, []);

  const handleMouseEnter = () => {
    setIsVisible(true);
    setIsPositioned(false);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setIsPositioned(false);
  };

  useEffect(() => {
    if (isVisible && !isPositioned) {
      // Use requestAnimationFrame to ensure tooltip is rendered before measuring
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [isVisible, isPositioned, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              visibility: isPositioned ? 'visible' : 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isPositioned ? 1 : 0, scale: isPositioned ? 1 : 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
