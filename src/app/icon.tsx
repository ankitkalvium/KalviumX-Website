import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          viewBox="0 0 60 60"
          width="32"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(4,4)">
            <rect x="0" y="0" width="50" height="50" stroke="#FF3535" strokeWidth="6" fill="none" />
            <path
              d="M10 12 L43 12 L10 37 L43 48"
              stroke="#FF3535"
              strokeWidth="6"
              strokeLinejoin="miter"
              fill="none"
            />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
