"use client";

import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialTime: number, onTimeUp: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      onTimeUp();
      setIsRunning(false);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isRunning, onTimeUp]);

  const startTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(true);
  }, [initialTime]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  }, [initialTime]);
  
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);


  return { timeLeft, startTimer, stopTimer, resetTimer, isRunning, pauseTimer, resumeTimer };
}
