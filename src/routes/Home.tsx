import { useEffect, useState } from "react";
import { getHash } from "../utils/getHash";
import IframePlayer from "../components/IframePlayer";

const EXAMPLES = [
  {
    title: "Princip slasti 1/10 - dabing, puvodni zneni, AD, titulky",
    idec: "417233100051001",
  },
  {
    title: "Princip slasti - 18+ labeling soucasti playlistu",
    idec: "219254002211001",
  },
  {
    title: "Mimořádné pořady ČT24 1. březen - indexy",
    idec: "222411033230301",
  },
  {
    title: "Vrazedne stiny ep 2 - labeling soucasti vastu",
    idec: "220512120060002",
  },
  {
    title: "Vicenasobny playlist",
    idec: "322291310020006",
  },
];

const ENVS = [
  "https://player-testing.vecko.dev/",
  "https://player-development.vecko.dev/",
  "https://player-staging.vecko.dev/",
  "https://player.ceskatelevize.cz",
  "http://localhost:7000/",
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState("");
  const [idec, setIdec] = useState("");
  const [live, setLive] = useState("");
  const [envIndex, setEnvIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const dejMiHash = async () => {
    setLoading(true);
    setHash("Loading!");
    try {
      const hash = await getHash();
      setHash(hash);
    } catch (e) {
      console.log("Smula", e);
      setHash("Error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dejMiHash();
  }, []);

  const params = live
    ? `hash=${hash}&live=${live}${autoplay ? "&autostart=true" : ""}`
    : `hash=${hash}&idec=${idec}${autoplay ? "&autostart=true" : ""}`;

  const previewEnvIndex = envIndex % ENVS.length;
  return (
    <div>
      <textarea style={{ width: 340 }} readOnly value={hash} />
      <div>
        <button disabled={loading} onClick={dejMiHash}>
          Refresh hash
        </button>
      </div>
      <div style={{ margin: "24px 0" }}>
        <input
          value={idec}
          placeholder="idec"
          type="text"
          onChange={(e) => {
            if (live) {
              setLive("");
            }
            setIdec(e.target.value);
          }}
        />
        <span> nebo </span>
        <input
          value={live}
          placeholder="live (napr. 24) "
          type="text"
          onChange={(e) => {
            if (idec) {
              setIdec("");
            }
            setLive(e.target.value);
          }}
        />
        <div>
          <input
            id="autoplay"
            type="checkbox"
            onChange={(e) => setAutoplay(e.target.checked)}
          />
          <label htmlFor="autoplay">Autoplay</label>
        </div>
        <div>
          {ENVS.map((env) => (
            <pre key={env} style={{ margin: "8px 0" }}>
              <a
                href={`${env}?${params}`}
                target="_blank"
                rel="noreferrer"
              >{`${env}?${params}`}</a>
            </pre>
          ))}
        </div>
        <div style={{ margin: "12px 0" }}>
          <b>Preview zdroj: </b>
          <select
            id="envs"
            name="envs"
            onChange={(e) => {
              setEnvIndex(Number(e.target.value));
            }}
          >
            {ENVS.map((env, index) => (
              <option key={env} value={index}>
                {env}
              </option>
            ))}
          </select>
          <div>
            (Na devu jsou vypnute reklamy. Jina prostredi by mela mit reklamy
            zapnute.)
          </div>
          <IframePlayer
            idec={idec}
            live={live}
            src={`${ENVS[previewEnvIndex]}?${params}`}
          />
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <b>Příklady:</b>
        {EXAMPLES.map((ex) => (
          <div key={ex.idec} style={{ margin: "6px 0" }}>
            <div>{ex.title}</div>
            <button
              onClick={() => {
                if (live) {
                  setLive("");
                }
                setIdec(ex.idec);
              }}
            >
              {ex.idec}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
