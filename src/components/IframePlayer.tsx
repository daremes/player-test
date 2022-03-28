import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    width: "100%",
    height: "100%",
    margin: "12px 0",
    border: "none",
    position: "relative",
  },
});

export default function IframePlayer({ id, src, onReload }: any) {
  const [refreshKey, setRefreshKey] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(768);
  const classes = useStyles();

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    const ref = wrapperRef.current;

    const onResize = () => {
      setWidth(ref.clientWidth);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div className={classes.wrapper} key={refreshKey} ref={wrapperRef}>
        <iframe
          allowFullScreen
          allow="encrypted-media;geolocation;autoplay"
          frameBorder="0"
          role="application"
          title="testing"
          style={{ width, height: width * 0.5625 }}
          src={src}
        />
        {!id && (
          <div
            style={{
              position: "absolute",
              fontSize: 24,
              top: 0,
              width: "100%",
              background: "rgba(255,255,255, 0.5)",
            }}
          >
            Zadejte nejaky idec/live
          </div>
        )}
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
    </>
  );
}
