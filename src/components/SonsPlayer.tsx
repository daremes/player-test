import { useState, useEffect } from "react";
import IframePlayer from "./IframePlayer";
import { getHash } from "../utils/getHash";

export default function SonsPlayer({ live, idec }: any) {
  const [hash, setHash] = useState<string | null>(null);

  const regenerateHash = async () => {
    const hash = await getHash();
    console.log(hash);
    setHash(hash);
  };

  useEffect(() => {
    regenerateHash();
  }, []);

  const src = `https://player.ceskatelevize.cz/?hash=${hash}&${
    idec ? `idec=${idec}` : `live=${live}`
  } `;
  return (
    <div>
      {hash && (
        <IframePlayer id={idec || live} src={src} onReload={regenerateHash} />
      )}
    </div>
  );
}
