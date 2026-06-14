import React, { useState, useEffect } from 'react';
import { User, ArrowRight, Wifi, BatteryMedium, Power } from 'lucide-react';
import styles from './LoginScreen.module.css';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [phase, setPhase] = useState<'typing' | 'loading'>('typing');
  const [isFading, setIsFading] = useState(false);
  
  const targetPassword = "statpassword";

  useEffect(() => {
    let currentIndex = 0;
    
    // Función para simular el tipeo natural humano
    const typeNext = () => {
      if (currentIndex < targetPassword.length) {
        setPassword(targetPassword.slice(0, currentIndex + 1));
        currentIndex++;
        // Retraso aleatorio entre 50ms y 150ms por cada tecla
        setTimeout(typeNext, Math.random() * 100 + 50);
      } else {
        // Pausa breve antes de darle al "Enter"
        setTimeout(() => {
          setPhase('loading');
          
          // Pantalla de carga (Te damos la bienvenida)
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onLogin, 800); // Coincide con la duración del fadeOut CSS
          }, 2000);
        }, 600);
      }
    };
    
    // Comienza a teclear después de 1 segundo de haber cargado la pantalla
    const startDelay = setTimeout(typeNext, 1000);
    return () => clearTimeout(startDelay);
  }, [onLogin]);

  return (
    <div className={`${styles.container} ${isFading ? styles.fadeOut : ''}`}>
      <div className={styles.backdropBlur}></div>
      
      <div className={styles.content}>
        <div className={styles.avatar}>
          <User size={80} color="#e2e8f0" strokeWidth={1.5} />
        </div>
        
        <h1 className={styles.userName}>Usuario de Nivora</h1>
        
        {phase === 'typing' ? (
          <div className={styles.passwordContainer}>
            <input 
              type="password" 
              className={styles.passwordInput} 
              value={password}
              readOnly
              placeholder="PIN"
            />
            <button className={`${styles.submitBtn} ${password.length > 0 ? styles.active : ''}`}>
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <div className={styles.welcomeText}>Te damos la bienvenida</div>
          </div>
        )}
      </div>

      <div className={styles.bottomControls}>
        <button className={styles.iconButton}><Wifi size={24} /></button>
        <button className={styles.iconButton}><BatteryMedium size={24} /></button>
        <button className={styles.iconButton}><Power size={24} /></button>
      </div>
    </div>
  );
}
