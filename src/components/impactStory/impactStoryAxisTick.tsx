import { IMPACT_STORY_COLORS } from "./projectImpactStoryChartColors";

interface ImpactStoryAxisTickEntry {
  fullLabel: string;
  labelLines: string[];
}

function resolveTickEntry(
  data: ImpactStoryAxisTickEntry[],
  index?: number,
): ImpactStoryAxisTickEntry | undefined {
  return index === undefined ? undefined : data[index];
}

export function ImpactStoryVerticalAxisTick({
  x,
  y,
  index,
  data,
  lineHeight = 11,
}: {
  x?: number;
  y?: number;
  index?: number;
  data: ImpactStoryAxisTickEntry[];
  lineHeight?: number;
}) {
  const entry = resolveTickEntry(data, index);
  if (!entry || x === undefined || y === undefined) {
    return null;
  }

  const firstLineOffset =
    entry.labelLines.length > 1
      ? -((entry.labelLines.length - 1) * lineHeight) / 2
      : 4;

  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
      fontSize={10}
      fill={IMPACT_STORY_COLORS.inkSoft}
    >
      {entry.labelLines.map((line, lineIndex) => (
        <tspan
          key={`${entry.fullLabel}-${lineIndex}`}
          x={x}
          dy={lineIndex === 0 ? firstLineOffset : lineHeight}
        >
          {line}
        </tspan>
      ))}
      <title>{entry.fullLabel}</title>
    </text>
  );
}

export function ImpactStoryHorizontalAxisTick({
  x,
  y,
  index,
  data,
  angle = 0,
  lineHeight = 11,
}: {
  x?: number;
  y?: number;
  index?: number;
  data: ImpactStoryAxisTickEntry[];
  angle?: number;
  lineHeight?: number;
}) {
  const entry = resolveTickEntry(data, index);
  if (!entry || x === undefined || y === undefined) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      dy={angle === 0 ? 10 : 12}
      textAnchor={angle === 0 ? "middle" : "end"}
      transform={angle === 0 ? undefined : `rotate(${angle}, ${x}, ${y})`}
      fontSize={10}
      fill={IMPACT_STORY_COLORS.inkSoft}
    >
      {entry.labelLines.map((line, lineIndex) => (
        <tspan
          key={`${entry.fullLabel}-${lineIndex}`}
          x={x}
          dy={lineIndex === 0 ? 0 : lineHeight}
        >
          {line}
        </tspan>
      ))}
      <title>{entry.fullLabel}</title>
    </text>
  );
}
