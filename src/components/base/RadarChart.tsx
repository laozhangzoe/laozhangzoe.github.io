import { useMemo } from 'react';

interface RadarChartProps {
  labels: string[];
  values: number[];
  size?: number;
  color?: string;
  maxValue?: number;
}

export default function RadarChart({
  labels,
  values,
  size = 280,
  color = 'primary',
  maxValue = 100,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const levels = 5;
  const labelOffset = size * 0.08;

  const axes = useMemo(() => {
    const count = labels.length;
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      return { angle, cos: Math.cos(angle), sin: Math.sin(angle) };
    });
  }, [labels.length]);

  const points = useMemo(() => {
    return values.map((v, i) => {
      const ratio = Math.min(Math.max(v, 0), maxValue) / maxValue;
      const ax = axes[i];
      return {
        x: cx + radius * ratio * ax.cos,
        y: cy + radius * ratio * ax.sin,
      };
    });
  }, [values, axes, cx, cy, radius, maxValue]);

  const polygonPath = useMemo(() => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  }, [points]);

  // Resolve fill/stroke colors from StyleSystem tokens
  const fillColor = useMemo(() => {
    if (color === 'accent') return 'oklch(var(--accent-500) / 0.18)';
    return 'oklch(var(--primary-500) / 0.18)';
  }, [color]);

  const strokeColor = useMemo(() => {
    if (color === 'accent') return 'oklch(var(--accent-500))';
    return 'oklch(var(--primary-500))';
  }, [color]);

  const dotColor = useMemo(() => {
    if (color === 'accent') return 'oklch(var(--accent-500))';
    return 'oklch(var(--primary-500))';
  }, [color]);

  const gridStroke = 'oklch(var(--foreground-300) / 0.3)';
  const axisStroke = 'oklch(var(--foreground-300) / 0.25)';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid rings */}
      {Array.from({ length: levels }, (_, i) => {
        const levelRadius = (radius / levels) * (i + 1);
        const gridPoints = axes
          .map((a) => `${cx + levelRadius * a.cos},${cy + levelRadius * a.sin}`)
          .join(' ');
        return (
          <polygon
            key={`grid-${i}`}
            points={gridPoints}
            fill="none"
            stroke={gridStroke}
            strokeWidth="1"
          />
        );
      })}

      {/* Axes */}
      {axes.map((a, i) => (
        <line
          key={`axis-${i}`}
          x1={cx}
          y1={cy}
          x2={cx + radius * a.cos}
          y2={cy + radius * a.sin}
          stroke={axisStroke}
          strokeWidth="1"
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={`dot-${i}`}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="white"
          stroke={dotColor}
          strokeWidth="2.5"
        />
      ))}

      {/* Labels */}
      {axes.map((a, i) => {
        const lx = cx + (radius + labelOffset) * a.cos;
        const ly = cy + (radius + labelOffset) * a.sin;
        let textAnchor = 'middle';
        if (a.cos > 0.2) textAnchor = 'start';
        else if (a.cos < -0.2) textAnchor = 'end';

        let dy = '0';
        if (a.sin < -0.5) dy = '-0.3em';
        else if (a.sin > 0.5) dy = '1.2em';

        return (
          <text
            key={`label-${i}`}
            x={lx}
            y={ly}
            textAnchor={textAnchor}
            dy={dy}
            className="fill-foreground-600"
            style={{ fontSize: '12px', fontFamily: 'var(--font-body, sans-serif)' }}
          >
            {labels[i]}
          </text>
        );
      })}

      {/* Value labels at points */}
      {points.map((p, i) => (
        <text
          key={`val-${i}`}
          x={p.x}
          y={p.y - 10}
          textAnchor="middle"
          className="fill-foreground-800"
          style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-label, sans-serif)' }}
        >
          {values[i]}
        </text>
      ))}
    </svg>
  );
}