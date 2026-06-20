import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          viewBox="0 0 64 64"
          width="180"
          height="180"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="64" height="64" fill="#FF3535" />
          <g transform="translate(7,7)" stroke="white" strokeWidth="6" fill="none">
            <rect width="50" height="50" />
            <path d="M10 12L43 12L10 37L43 48" strokeLinejoin="miter" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
