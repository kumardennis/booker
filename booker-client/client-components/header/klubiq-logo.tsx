export const KlubiqLogo = ({ height = 22 }: { height?: number }) => {
  const aspectRatio = 110 / 22;
  const width = height * aspectRatio;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Klubiq"
    >
      {/* Mark: stylised hexagon with a K cut */}
      <polygon
        points="11,1 20,6 20,16 11,21 2,16 2,6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* K inside hexagon */}
      <line
        x1="8"
        y1="7"
        x2="8"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="11"
        x2="14"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="11"
        x2="14"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Wordmark */}
      <text
        x="26"
        y="15.5"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="11"
        fontWeight="600"
        letterSpacing="2"
        fill="currentColor"
      >
        KLUBIQ
      </text>
    </svg>
  );
};
