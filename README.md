# NivoraApp (StatOS)

**Autor:** Jonathan Alexander Aguirre Chavez  
**Fecha:** 14/06/2026  
**Versión:** 1.0.3  

---

## 1. Introducción

### 1.1. Contexto
NivoraApp es una plataforma web interactiva y altamente dinámica desarrollada con **Next.js** y **React**. Su principal innovación radica en la implementación de una interfaz gráfica que emula un sistema operativo de escritorio (denominado **StatOS**). Esta simulación abarca desde la secuencia de arranque hasta un entorno de trabajo basado en ventanas, ofreciendo una experiencia de usuario (UX) inmersiva y multitarea.

### 1.2. Objetivo
Proveer un ecosistema integral para el cálculo, análisis estadístico y modelado probabilístico, facilitando a los usuarios operar simultáneamente con múltiples conjuntos de datos a través de un paradigma de ventanas que maximiza la productividad y la retención visual.

### 1.3. Alcance
El documento detalla la arquitectura de simulación del sistema operativo, el diseño del gestor de ventanas (Window Manager), y las especificaciones técnicas para el despliegue del código fuente en entornos de desarrollo local.

---

## 2. Desarrollo

### 2.1. Simulación del Sistema Operativo
La aplicación gestiona su ciclo de vida a través de una máquina de estados secuencial que reproduce fielmente el encendido de una computadora moderna:

1. **Landing:** Pantalla de bienvenida interactiva.
2. **Boot Sequence:** Simulación gráfica del arranque del sistema (BIOS/UEFI), integrando un logotipo geométrico inspirado en entornos de escritorio modernos.
3. **Login Screen:** Pantalla de autenticación animada que incorpora un fondo de escritorio y un sistema simulado de tecleo de credenciales (tecleo natural con delays aleatorios) que da paso al entorno principal.
4. **Entorno de Escritorio (StatOS):** Interfaz principal que alberga los accesos directos, barra de tareas y el gestor de ventanas.

### 2.2. Arquitectura del Gestor de Ventanas (Window Manager)
El núcleo de la interfaz de usuario es su sistema de gestión de ventanas, construido de forma nativa sin depender de librerías externas pesadas. Destaca por las siguientes capacidades:

* **Manipulación Física (Arrastrable y Redimensionable):** Cada ventana es completamente interactiva. Los usuarios pueden arrastrarlas libremente por el escritorio virtual y ajustar sus dimensiones para adaptar el espacio de trabajo.
* **Organización en Mosaico (Tiling Layout):** Implementa un algoritmo matemático (`applyTilingLayout`) que redistribuye automáticamente las ventanas abiertas de forma equitativa en la pantalla (split horizontal, cuadriculado), optimizando el espacio sin solapamientos cuando el usuario lo requiere.
* **Gestión Dinámica de Profundidad (Z-Index):** Un sistema de enfoque que detecta la interacción del usuario y trae inmediatamente la ventana activa al primer plano (`focusWindow`), empujando las demás hacia atrás.
* **Controles de Estado Completos:** Las ventanas soportan acciones estándar de SO como minimizar a la barra de tareas, maximizar a pantalla completa, restaurar tamaño y cerrar.

### 2.3. Aplicaciones Integradas
El sistema StatOS ejecuta tres aplicaciones estadístico-matemáticas de forma paralela:

1. **Estadística Descriptiva:** Módulo para la agrupación de datos, cálculo de medidas de tendencia central y creación de distribuciones de frecuencia (ej. regla de Sturges).
2. **Visualizador de Datos:** Motor de gráficas interactivo para la representación visual de la información introducida en el módulo descriptivo.
3. **Calculadora de Probabilidad:** Herramienta enfocada en modelos matemáticos y distribuciones probabilísticas.

### 2.4. Tecnologías y Herramientas

| Categoría | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 16.2.7 | Renderizado y enrutamiento |
| **Librería UI** | React | 19.2.4 | Construcción de interfaces interactivas |
| **Lenguaje** | TypeScript | 5.x | Tipado estático y seguridad de código |
| **Estilos** | Tailwind CSS | 4.x | Sistema de diseño de componentes |
| **Iconografía**| Lucide React | 1.17.0 | Recursos visuales para el escritorio |

### 2.5. Procedimiento de Ejecución
Para iniciar el entorno de desarrollo y explorar la interfaz del OS, siga esta secuencia:

1. Clonar el repositorio en su directorio local.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 3. Conclusión

### 3.1. Resumen Técnico
NivoraApp (StatOS) demuestra un uso avanzado de las capacidades de gestión de estado de React, logrando simular un entorno de escritorio fluido y responsivo. El diseño del **Window Manager** no solo cumple una función estética, sino que mejora drásticamente el flujo de análisis de datos al permitir vistas simultáneas y personalizables.

