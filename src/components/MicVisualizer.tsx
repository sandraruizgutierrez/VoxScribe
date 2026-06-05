import React, { useEffect, useState } from "react";

interface MicVisualizerProps {
  isActive: boolean;
  color?: string;
  count?: number;
}

export function MicVisualizer({ isActive, color = "bg-rose-500", count = 12 }: MicVisualizerProps) {
  const [heights, setHeights] = useState<number[]>(new Array(count).fill(15));

  useEffect(() => {
    if (!isActive) {
      setHeights(new Array(count).fill(15));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: count }, () => Math.floor(Math.random() * 50) + 10)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isActive, count]);

  return (
    <div className="flex items-center justify-center gap-1.5 h-16 pointer-events-none">
      {heights.map((height, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${color}`}
          style={{
            height: `${isActive ? height : 6}px`,
            opacity: isActive ? 0.3 + (i % 3) * 0.2 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default MicVisualizer;
