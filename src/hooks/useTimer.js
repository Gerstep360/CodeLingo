import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(initialMinutes = 45, onExpire = null) {
  const [minutesSetting, setMinutesSetting] = useState(initialMinutes);
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Sync when initialMinutes change from outside
  const setMinutes = useCallback((newMins) => {
    const mins = Math.max(1, Math.min(180, Number(newMins) || 45));
    setMinutesSetting(mins);
    setSecondsRemaining(mins * 60);
    setIsRunning(false);
    setHasStarted(false);
  }, []);

  const start = useCallback(() => {
    if (secondsRemaining > 0) {
      setIsRunning(true);
      setHasStarted(true);
    }
  }, [secondsRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, pause, start]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setHasStarted(false);
    setSecondsRemaining(minutesSetting * 60);
  }, [minutesSetting]);

  const addMinutes = useCallback((delta) => {
    setMinutesSetting((prev) => {
      const updated = Math.max(1, Math.min(180, prev + delta));
      setSecondsRemaining((sec) => Math.max(0, sec + delta * 60));
      return updated;
    });
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            if (onExpireRef.current) {
              onExpireRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  // Format time mm:ss
  const formatTime = useCallback(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const mins = Math.floor((secondsRemaining % 3600) / 60);
    const secs = secondsRemaining % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  }, [secondsRemaining]);

  const progressPercent = Math.max(
    0,
    Math.min(100, ((minutesSetting * 60 - secondsRemaining) / (minutesSetting * 60)) * 100)
  );

  return {
    secondsRemaining,
    minutesSetting,
    isRunning,
    hasStarted,
    isExpired: secondsRemaining === 0,
    formattedTime: formatTime(),
    progressPercent,
    start,
    pause,
    toggle,
    reset,
    setMinutes,
    addMinutes
  };
}
