import React from "react";

interface RadarDimension {
  label: string;
  value: number; // 0 ~ 100
  fullMark?: number;
}

interface RadarChartProps {
  dimensions: RadarDimension[];
  size?: number;
  color?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  dimensions,
  size = 280,
  color = "#D97706"
}) => {
  if (!dimensions || dimensions.length < 3) return null;

  const count = dimensions.length;
  const center = size / 2;
  const radius = center * 0.65;
  const angleStep = (Math.PI * 2) / count;

  // 生成层级多边形背景网格 (4 层)
  const levels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = levels.map((level) => {
    const points = dimensions.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * level * Math.cos(angle);
      const y = center + radius * level * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(" ");
  });

  // 映射真实数据多边形
  const dataPoints = dimensions.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const maxVal = d.fullMark || 100;
    const normRatio = Math.min(1, Math.max(0, d.value / maxVal));
    const x = center + radius * normRatio * Math.cos(angle);
    const y = center + radius * normRatio * Math.sin(angle);
    return { x, y, label: d.label, value: d.value };
  });

  const polygonString = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* 背景放射轴 */}
        {dimensions.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#FDE68A"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* 背景多边形网格 */}
        {gridPolygons.map((poly, idx) => (
          <polygon
            key={idx}
            points={poly}
            fill={idx === levels.length - 1 ? "#FFFDF5" : "none"}
            stroke="#FCD34D"
            strokeWidth="1"
            opacity={0.6 + idx * 0.1}
          />
        ))}

        {/* 数据雷达区域 */}
        <polygon
          points={polygonString}
          fill="rgba(245, 197, 24, 0.25)"
          stroke={color}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 数据关键节点顶点 */}
        {dataPoints.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="5" fill="#1E2066" stroke="#FFE100" strokeWidth="2" />
          </g>
        ))}

        {/* 维度文本标签排版 */}
        {dimensions.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 22;
          const lx = center + labelRadius * Math.cos(angle);
          const ly = center + labelRadius * Math.sin(angle);
          const anchor = Math.abs(Math.cos(angle)) < 0.2 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";

          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="text-[11px] font-extrabold fill-slate-700 select-none"
            >
              {d.label} ({d.value})
            </text>
          );
        })}
      </svg>
    </div>
  );
};
