"use client";
import { Joyride, Step, CallBackProps, STATUS } from 'react-joyride';
import { useState, useEffect } from 'react';

const steps: Step[] = [
  {
    target: '.sidebar-container',
    content: 'Bienvenido al Workspace Estadístico. Usa esta barra lateral para navegar por los diferentes módulos de análisis.',
    disableBeacon: true,
  },
  {
    target: '.tour-upload',
    content: 'Aquí puedes ingresar tus datos manualmente o subir un archivo CSV. ¡Nosotros nos encargamos de filtrarlo!',
  },
  {
    target: '.tour-cards',
    content: 'Tus métricas principales aparecerán aquí. ¡Haz clic en cualquiera de ellas para ver su explicación y fórmula matemática paso a paso!',
  },
  {
    target: '.tour-charts',
    content: 'Visualiza tus datos con gráficos profesionales. Revisa las notas educativas debajo de cada uno para aprender a interpretarlos.',
  },
  {
    target: '.tour-table',
    content: 'Explora tu distribución. Haz clic en "Modo Avanzado" para revelar las columnas completas (xᵢ, fᵢ, hᵢ, etc.) útiles para cálculos manuales.',
  }
];

export default function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('nivora-tour-seen');
    if (!hasSeenTour) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setRun(true), 1500);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem('nivora-tour-seen', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: 'var(--bg-secondary)',
          backgroundColor: 'var(--bg-secondary)',
          overlayColor: 'rgba(15, 23, 42, 0.7)',
          primaryColor: 'var(--accent-blue)',
          textColor: 'var(--text-main)',
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: 'left',
          fontSize: '0.875rem',
        },
        buttonNext: {
          backgroundColor: 'var(--text-main)',
          color: 'var(--bg-primary)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          borderRadius: '6px',
        },
        buttonBack: {
          color: 'var(--text-subtle)',
          fontSize: '0.8125rem',
        },
        buttonSkip: {
          color: 'var(--text-muted)',
          fontSize: '0.8125rem',
        }
      }}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar Tour'
      }}
    />
  );
}
