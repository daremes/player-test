import { useEffect, useState } from "react";
import { getHash } from "../utils/getHash";
import IframePlayer from "../components/IframePlayer";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },
  playerWrapper: {
    width: "100%",
    maxWidth: 900,
  },
  content: {
    width: "100%",
    maxWidth: 1200,
  },
  note: {
    fontSize: 10,
  },
});

const EXAMPLES = [
  {
    title: "Rapstory 1/10 - reklamy i pro Safari",
    idec: "220562280010001",
    videoTitle: "Rapstory 1/10",
    showId: "1234",
  },
  {
    title: "Bonus - Novinarky",
    bonus: "42128",
    videoTitle: "Novinářky",
    showId: "1234",
  },
  {
    title: "Bonus - pouze audio",
    bonus: "32433",
    videoTitle: "1968: Dnes před 50 lety",
    showId: "12171864678",
  },
  {
    title: "Princip slasti 1/10 - dabing, puvodni zneni, AD, titulky",
    idec: "417233100051001",
    videoTitle: "Princip slasti 1/10",
    showId: "1234",
  },
  {
    title: "Princip slasti - 18+ labeling soucasti playlistu",
    idec: "219254002211001",
    videoTitle: "Princip slasti 1/10",
    showId: "1234",
  },
  {
    title: "Mimořádné pořady ČT24 1. březen - indexy",
    idec: "222411033230301",
    videoTitle: "Mimořádné pořady ČT24 1. březen",
    showId: "1234",
  },
  {
    title: "Vrazedne stiny ep 2 - labeling soucasti vastu",
    idec: "220512120060002",
    videoTitle: "Vražedné stíny 2/10",
    showId: "1234",
  },
  {
    title: "Vicenasobny playlist",
    idec: "322291310020006",
    videoTitle: "Nevim",
    showId: "1234",
  },
  {
    title: "168 hodin - skryte titulky",
    idec: "222452801100410",
    videoTitle: "10. duben",
    showId: "10117034229",
  },
  {
    title: "168 hodin - skryte titulky",
    idec: "222452801100403",
    videoTitle: "3. duben",
    showId: "10117034229",
  },
  {
    title: "168 hodin - skryte titulky",
    idec: "222452801100327",
    videoTitle: "27. březen",
    showId: "10117034229",
  },
];

const ENVS = [
  "https://player.ceskatelevize.cz",
  "https://player-testing.vecko.dev/",
  "https://player-development.vecko.dev/",
  "https://player-staging.vecko.dev/",
  "http://localhost:7000/",
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState("");
  const [idec, setIdec] = useState("");
  const [live, setLive] = useState("");
  const [bonus, setBonus] = useState("");
  const [envIndex, setEnvIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState(false);
  const classes = useStyles();
  const [videoTitle, setVideoTitle] = useState("");
  const [showId, setShowId] = useState("");

  useEffect(() => {
    const relevant = EXAMPLES.find(
      (ex) => ex.idec === idec || ex.bonus === bonus
    );
    if (live || !relevant) {
      setVideoTitle("");
      setShowId("");
      return;
    }
    setVideoTitle(relevant.videoTitle);
    setShowId(relevant.showId);
  }, [idec, live, bonus]);

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

  const getParams = () => {
    if (live) {
      return `hash=${hash}&live=${live}${autoplay ? "&autostart=true" : ""}${
        videoTitle ? "&title=" + videoTitle : ""
      }${showId ? "&sidp=" + showId : ""}&useNewPlaylist=${newPlaylist}`;
    }
    if (idec) {
      return `hash=${hash}&idec=${idec}${autoplay ? "&autostart=true" : ""}${
        videoTitle ? "&title=" + videoTitle : ""
      }${showId ? "&sidp=" + showId : ""}&useNewPlaylist=${newPlaylist}`;
    }
    if (bonus) {
      return `hash=${hash}&bonus=${bonus}${autoplay ? "&autostart=true" : ""}${
        videoTitle ? "&title=" + videoTitle : ""
      }${showId ? "&sidp=" + showId : ""}&useNewPlaylist=${newPlaylist}`;
    }
  };

  const params = getParams();

  const previewEnvIndex = envIndex % ENVS.length;
  const id = idec || live || bonus;
  return (
    <div className={classes.container}>
      <div className={classes.content}>
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
              if (bonus) {
                setBonus("");
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
              if (bonus) {
                setBonus("");
              }
              setLive(e.target.value);
            }}
          />
          <span> nebo </span>
          <input
            value={bonus}
            placeholder="bonus id"
            type="text"
            onChange={(e) => {
              if (idec) {
                setIdec("");
              }
              if (live) {
                setLive("");
              }
              setBonus(e.target.value);
            }}
          />
          <div style={{ margin: "8px 0" }}>
            <input
              id="autoplay"
              type="checkbox"
              onChange={(e) => setAutoplay(e.target.checked)}
            />
            <label htmlFor="autoplay">Autoplay</label>
          </div>
          <div style={{ margin: "8px 0" }}>
            <input
              id="newplaylist"
              type="checkbox"
              onChange={(e) => setNewPlaylist(e.target.checked)}
            />
            <label htmlFor="newplaylist">Nové playlisty</label>
          </div>
          <div className={classes.note}>
            (11.4.2022: zatím jen pro live a testing prostředí)
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
            {id && (
              <div className={classes.playerWrapper}>
                <IframePlayer
                  id={id}
                  src={`${ENVS[previewEnvIndex]}?${params}`}
                />
              </div>
            )}
          </div>
        </div>
        {id && (
          <div>
            {ENVS.map((env) => (
              <div key={env} style={{ margin: "8px 0" }}>
                <a
                  href={`${env}?${params}`}
                  target="_blank"
                  rel="noreferrer"
                >{`${env}?${params}`}</a>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 32 }}>
          <b>Příklady:</b>
          {EXAMPLES.map((ex) => (
            <div key={ex.idec || ex.bonus} style={{ margin: "6px 0" }}>
              <div>{ex.title}</div>
              <button
                onClick={() => {
                  if (live) {
                    setLive("");
                  }
                  if (ex.idec) {
                    setBonus("");
                    setIdec(ex.idec);
                  }
                  if (ex.bonus) {
                    setIdec("");
                    setBonus(ex.bonus);
                  }
                }}
              >
                {ex.idec || ex.bonus}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
