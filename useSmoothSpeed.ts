import { useState, useEffect, useRef } from 'react';


export const useSmoothSpeed = (apiSpeed: number, duration: number = 1500) => {
  const [displaySpeed, setDisplaySpeed] = useState(0);
 
  const lastValidSpeedRef = useRef(0);
  const zeroCountRef = useRef(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const animationTargetRef = useRef(0);

  const animate = (time: number) => {
    if (startTimeRef.current === undefined) {
      startTimeRef.current = time;
    }

    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const startValue = lastValidSpeedRef.current;
    const diff = animationTargetRef.current - startValue;
    const nextValue = startValue + diff * easedProgress;

    setDisplaySpeed(Math.round(nextValue));

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      lastValidSpeedRef.current = animationTargetRef.current;
      startTimeRef.current = undefined;
    }
  };

  useEffect(() => {
    let finalTarget = apiSpeed;

    if (apiSpeed === 0) {
      zeroCountRef.current += 1;
 
      if (zeroCountRef.current < 5 && lastValidSpeedRef.current > 0) {
        finalTarget = lastValidSpeedRef.current; 
      }
    } else {
      zeroCountRef.current = 0; 
    }

    const speedDifference = Math.abs(finalTarget - lastValidSpeedRef.current);
    if (speedDifference > 30 && lastValidSpeedRef.current > 0) {
      
      finalTarget = lastValidSpeedRef.current;
    }


    animationTargetRef.current = finalTarget;
    startTimeRef.current = undefined;
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [apiSpeed]);

  return displaySpeed;
};
