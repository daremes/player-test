import { useState } from "react";

export default function IframePlayer({ live, idec, src, onReload }: any) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div key={refreshKey}>
      {!idec && !live && (
        <div
          style={{
            position: "absolute",
            fontSize: 24,
            width: "100%",
            background: "rgba(255,255,255, 0.5)",
          }}
        >
          Zadejte nejaky idec/live
        </div>
      )}
      <div
        style={{
          width: 768,
          height: 768 * 0.5625,
          margin: "12px 0",
          border: "none",
        }}
      >
        <iframe
          allowFullScreen
          allow="encrypted-media;geolocation;autoplay"
          frameBorder="0"
          role="application"
          title="testing"
          style={{ width: "100%", height: "100%" }}
          src={src}
        />
      </div>
      <div>
        <button
          onClick={() => {
            if (onReload) {
              onReload();
            }
            setRefreshKey((prev) => prev + 1);
          }}
        >
          Reload
        </button>
      </div>
    </div>
  );
}
