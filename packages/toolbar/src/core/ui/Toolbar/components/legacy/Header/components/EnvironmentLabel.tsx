import { useRef, useState, useEffect } from 'react';
import * as styles from '../Header.css';

interface EnvironmentLabelProps {
  label: string;
}

export function EnvironmentLabel(props: EnvironmentLabelProps) {
  const { label } = props;
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTextClipped, setIsTextClipped] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const checkIfTextClipped = () => {
      if (textRef.current) {
        const element = textRef.current;
        setIsTextClipped(element.scrollWidth > element.clientWidth);
      }
    };

    checkIfTextClipped();
    // Recheck when the window resizes
    window.addEventListener('resize', checkIfTextClipped);
    return () => window.removeEventListener('resize', checkIfTextClipped);
  }, [label]);

  const handleMouseEnter = () => {
    if (isTextClipped) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={styles.centerSection}>
      <span
        ref={textRef}
        className={`${styles.environmentLabel} ${styles.environmentLabelWrapper}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={isTextClipped ? label : undefined}
      >
        {label}
        {showTooltip ? <div className={styles.environmentTooltip}>{label}</div> : null}
      </span>
    </div>
  );
}
