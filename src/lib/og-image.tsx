export const ogImageSize = { width: 1200, height: 630 };

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
          alignItems: "baseline",
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: -4,
        }}
      >
        <span style={{ color: "#f53333" }}>Kalvium</span>
        <span style={{ color: "#ffffff" }}>X</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 40,
          fontWeight: 700,
          color: "#ffffff",
          maxWidth: 880,
          lineHeight: 1.3,
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
        Pre-assessed · JD-matched · Mentor-managed · x.kalvium.com
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
