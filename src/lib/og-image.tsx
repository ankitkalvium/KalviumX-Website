export const ogImageSize = { width: 1200, height: 630 };

// Brand mark as inline SVG — red square with white K strokes
function BrandMark({ size = 80 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" fill="#f53333" />
      <rect x="8" y="8" width="48" height="48" fill="white" />
      <polygon points="8,8 32,32 8,56" fill="#f53333" />
      <polygon points="64,8 32,32 64,56" fill="#f53333" />
    </svg>
  );
}

export function OgImageContent() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        background: "#0e0e0e",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <BrandMark size={72} />
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -3,
          }}
        >
          <span style={{ color: "#f53333" }}>Kalvium</span>
          <span style={{ color: "#ffffff" }}>X</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 44,
          fontWeight: 700,
          color: "#ffffff",
          maxWidth: 900,
          lineHeight: 1.25,
        }}
      >
        Hire engineering interns your tech teams can trust.
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 24,
          fontWeight: 600,
          color: "#999999",
        }}
      >
        Pre-assessed · JD-matched · Mentor-managed
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 14,
          background: "#f53333",
        }}
      />
    </div>
  );
}
