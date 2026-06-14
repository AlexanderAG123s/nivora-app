import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import styles from './Landing.module.css';

interface LandingProps {
  onEnter: () => void;
}

export function Landing({ onEnter }: LandingProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 800); // Coincide con la duración de la transición en CSS
  };

  return (
    <div className={`${styles.container} ${isExiting ? styles.exiting : ''}`}>
      <div className={styles.backgroundShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
      </div>
      <div className={styles.gridOverlay}></div>
      
      <div className={styles.content}>
        <div className={styles.badge}>
          <Sparkles className="w-4 h-4 mr-2" />
          StatStudio
        </div>
        <h1 className={styles.title}>
          Probabilidad y <br/> <span className={styles.titleHighlight}>Estadística</span>
        </h1>
        <p className={styles.description}>
          Un entorno analítico inmersivo diseñado para la claridad. Explora distribuciones, 
          analiza tendencias y calcula probabilidades en una experiencia nativa y fluida.
        </p>
        
        <div className={styles.buttonContainer}>
          <button onClick={handleEnter} className={styles.primaryButton}>
            Acceder al Módulo
            <ArrowRight className={`w-5 h-5 ${styles.iconArrow}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
