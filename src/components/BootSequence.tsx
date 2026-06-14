import React, { useEffect, useState } from 'react';
import styles from './BootSequence.module.css';

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Keep the boot screen for a brief modern boot time
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 800); // Matches CSS transition duration
    }, 4500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`${styles.container} ${isFading ? styles.fadeOut : ''}`}>
      <div className={styles.logoContainer}>
        {/* Exact Windows 11 style logo: 4 flat flat-blue blocks */}
        <div className={styles.logoGrid}>
          <div className={styles.logoBlock}></div>
          <div className={styles.logoBlock}></div>
          <div className={styles.logoBlock}></div>
          <div className={styles.logoBlock}></div>
        </div>
      </div>
      
      <div className={styles.spinnerContainer}>
        <div className={styles.winSpinner}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
      </div>
    </div>
  );
}
