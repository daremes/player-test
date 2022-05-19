import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    width: "100%",
    height: "100%",
    margin: "12px 0",
    position: "relative",
    background: "transparent",
  },
  player: {
    boxShadow: "0 2px 4px 0 rgba(0,0,0,.3)",
    borderRadius: 4,
    border: "none",
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
          className={classes.player}
          allow="encrypted-media;geolocation;autoplay"
          role="application"
          title="testing"
          style={{ width, height: width * 0.5625 }}
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
    </>
  );
}
