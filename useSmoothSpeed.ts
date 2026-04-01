import { useState, useEffect, useRef, useCallback } from 'react';

export const useSmoothSpeed = (apiSpeed: number, duration: number = 1500) => {
  const [displaySpeed, setDisplaySpeed] = useState(0);

  const currentDisplayRef = useRef(0); 
  const zeroCountRef = useRef(0);
  const requestRef = useRef<number>();

  const animate = useCallback(
    (from: number, to: number, startTime: number, time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const next = from + (to - from) * easedProgress;
      const rounded = Math.round(next);

      currentDisplayRef.current = rounded;
      setDisplaySpeed(rounded);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame((t) =>
          animate(from, to, startTime, t)
        );
      }
    },
    [duration]
  );

  useEffect(() => {
    let finalTarget = apiSpeed;

    if (apiSpeed === 0) {
      zeroCountRef.current += 1;
    
      if (zeroCountRef.current < 5 && currentDisplayRef.current > 0) {
        finalTarget = currentDisplayRef.current;
      }
    } else {
      zeroCountRef.current = 0;

    
      const diff = Math.abs(apiSpeed - currentDisplayRef.current);
      if (diff > 50 && currentDisplayRef.current > 0) {
        return;
      }
    }

   
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

  
    const snapStart = currentDisplayRef.current;
    const startTime = performance.now();

    requestRef.current = requestAnimationFrame((t) =>
      animate(snapStart, finalTarget, startTime, t)
    );

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [apiSpeed, animate]);

  return displaySpeed;
};
