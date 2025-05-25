import { useRef, useLayoutEffect, useState } from 'react';

export function useFitText({ minFontSize = 10, maxFontSize = 32, resolution = 1 } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fit = () => {
      let currentFontSize = maxFontSize;
      node.style.fontSize = `${currentFontSize}px`;
      let fits = () => node.scrollHeight <= node.offsetHeight && node.scrollWidth <= node.offsetWidth;
      while (!fits() && currentFontSize > minFontSize) {
        currentFontSize -= resolution;
        node.style.fontSize = `${currentFontSize}px`;
      }
      setFontSize(currentFontSize);
    };

    fit();

    const resizeObserver = new window.ResizeObserver(fit);
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, [minFontSize, maxFontSize, resolution]);

  return { ref, fontSize };
} 