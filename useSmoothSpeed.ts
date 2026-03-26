import { useState, useEffect, useRef } from 'react';

export const useSmoothSpeed = (targetSpeed: number, duration: number = 1000) => {
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const currentSpeedRef = useRef(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (startTimeRef.current === undefined) {
      startTimeRef.current = time;
    }

    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth movement (Ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const startValue = currentSpeedRef.current;
    const diff = targetSpeed - startValue;
    const nextValue = startValue + diff * easedProgress;

    setDisplaySpeed(Math.round(nextValue));

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      currentSpeedRef.current = targetSpeed;
      startTimeRef.current = undefined;
    }
  };

  useEffect(() => {
    // Start animation when targetSpeed changes
    startTimeRef.current = undefined;
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [targetSpeed]);

  return displaySpeed;
};