export default function ArrowRight({ className = '', style = {} }) {
  return (
    <svg
      className={className}
      style={style}
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      overflow="visible"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="arrow-right">
        <path
          id="Vector"
          d="M5.2 12H18.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M12 5L19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
