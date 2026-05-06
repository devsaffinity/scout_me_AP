import { useEffect, useMemo, useRef, useState } from 'react';

const parseTarget = (value) => {
  if (typeof value === 'number') return { numeric: value, prefix: '', suffix: '' };

  const source = String(value ?? '');
  const match = source.match(/^([^0-9-]*)(-?\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return { numeric: 0, prefix: '', suffix: source };
  }

  return {
    prefix: match[1] || '',
    numeric: Number(match[2]),
    suffix: match[3] || '',
  };
};

export const useCountUp = ({
  end = 0,
  start = 0,
  duration = 1200,
  decimals = 0,
  formatter,
  startOnMount = true,
} = {}) => {
  const animationFrame = useRef(null);
  const [isPlaying, setIsPlaying] = useState(startOnMount);
  const target = useMemo(() => parseTarget(end), [end]);
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const startedAt = performance.now();
    const startValue = Number(start) || 0;
    const endValue = Number(target.numeric) || 0;

    const animate = (timestamp) => {
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const nextValue = startValue + (endValue - startValue) * progress;
      setValue(nextValue);

      if (progress < 1) {
        animationFrame.current = window.requestAnimationFrame(animate);
      }
    };

    animationFrame.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [duration, isPlaying, start, target.numeric]);

  const displayValue = useMemo(() => {
    if (typeof formatter === 'function') {
      return formatter(value);
    }

    const rounded = Number(value).toFixed(decimals);
    return `${target.prefix}${rounded}${target.suffix}`;
  }, [decimals, formatter, target.prefix, target.suffix, value]);

  return {
    value,
    displayValue,
    isPlaying,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    reset: () => {
      setValue(start);
      setIsPlaying(false);
    },
  };
};

export default useCountUp;
