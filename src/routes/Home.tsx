import { useEffect, useState } from "react";
import { getHash } from "../utils/getHash";
import IframePlayer from "../components/IframePlayer";
import { createUseStyles } from "react-jss";

const CHANNELS = [
  "CH_1",
  "CH_2",
  "CH_24",
  "CH_4",
  "CH_5",
  "CH_6",
  "CH_7",
  "CH_1_JM",
  "CH_1_SM",
  "CH_25",
  "CH_26",
  "CH_27",
  "CH_28",
  "CH_29",
  "CH_30",
  "CH_31",
  "CH_32",
  "CH_MOB_01",
];

const getQueryString = (params: any) => {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
};

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
    title: "Světy Jindřicha Chalupeckého - playback samostatneho indexu",
    idec: "2222041120000120318",
    index: "900837",
    videoTitle: "Světy Jindřicha Chalupeckého",
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
    title: "Cyklotoulky - AD",
    idec: "221471292050042",
    videoTitle: "Cyklotoulky Opava",
    showId: "1234",
  },
  {
    title: "Angličtina s Hurvínkem - AD",
    idec: "214542157910035",
    videoTitle: "Angličtina s Hurvínkem",
    showId: "1234",
  },
  {
    title: "Klobouček / Dan Bárta trio - pouze jedna kvalita",
    idec: "21154215446",
    videoTitle: "Klobouček / Dan Bárta trio",
    showId: "1234",
  },
  {
    title: "Země orlů - omezeny set kvalit",
    idec: "26153232260",
    videoTitle: "Země orlů",
    showId: "1234",
  },
  {
    title: "Písničky pro pamětníky - bez fullHD",
    idec: "27832024069",
    videoTitle: "Písničky pro pamětníky",
    showId: "1234",
  },
  {
    title: "Pocasi - video pod 5min",
    idec: "206411000400124",
    videoTitle: "Pocasi",
    showId: "1234",
  },
  {
    title: "O pohár prezidenta ČTS - video nad 5h",
    idec: "220471291352003",
    videoTitle: "O pohár prezidenta ČTS",
    showId: "1234",
  },
  {
    title: "Území strachu 4:3",
    idec: "28631033712",
    videoTitle: "Území strachu",
    showId: "1234",
  },
  {
    title: "Kosovo - krev není voda - non-provys",
    idec: "21225100058",
    videoTitle: "Kosovo - krev není voda",
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
  "https://player.ceskatelevize.cz/",
  "https://player-testing.vecko.dev/",
  "https://player-development.vecko.dev/",
  "https://player-staging.vecko.dev/",
  "http://localhost:7000/",
  "http://192.168.0.2:7000/",
];

const DEFAULT_OPTIONS = {
  idec: "",
  live: "",
  bonus: "",
  videoId: "",
  index: "",
};

const minutesToMillis = (minutes: number) => {
  return minutes * 60 * 1000;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState("");
  const [id, setId] = useState({ ...DEFAULT_OPTIONS });
  const [envIndex, setEnvIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState(false);
  const classes = useStyles();
  const [videoTitle, setVideoTitle] = useState("");
  const [showId, setShowId] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [debugStreamPausedTimeout, setDebugStreamPausedTimeout] = useState("");
  const [debugStreamUrlExpiredTimeout, setDebugStreamUrlExpiredTimeout] =
    useState("");

  useEffect(() => {
    const relevant = EXAMPLES.find(
      (ex) => ex.idec === id.idec || ex.bonus === id.bonus
    );
    if (id.live || !relevant) {
      setVideoTitle("");
      setShowId("");
      return;
    }
    setVideoTitle(relevant.videoTitle);
    setShowId(relevant.showId);
  }, [id.bonus, id.idec, id.live]);

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

  const parameters = {
    hash,
    autoStart: autoplay,
    ...(id.videoId ? { videoId: id.videoId } : {}),
    ...(id.live ? { live: id.live } : {}),
    ...(id.idec ? { IDEC: id.idec } : {}),
    ...(id.bonus ? { bonus: id.bonus } : {}),
    ...(id.index ? { index: id.index } : {}),
    ...(showId ? { sidp: showId } : {}),
    ...(newPlaylist ? { useNewPlaylist: newPlaylist } : {}),
    ...(videoTitle ? { title: videoTitle } : {}),
    ...(debugStreamPausedTimeout && !isNaN(Number(debugStreamPausedTimeout))
      ? {
          debugStreamPausedTimeout: minutesToMillis(
            Number(debugStreamPausedTimeout)
          ),
        }
      : {}),
    ...(debugStreamUrlExpiredTimeout &&
    !isNaN(Number(debugStreamUrlExpiredTimeout))
      ? {
          debugStreamUrlExpiredTimeout: minutesToMillis(
            Number(debugStreamUrlExpiredTimeout)
          ),
        }
      : {}),
  };

  const queryString = getQueryString(parameters);

  const previewEnvIndex = envIndex % ENVS.length;
  const hasId = id.idec || id.live || id.bonus || id.videoId;
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
            value={id.idec}
            placeholder="idec"
            type="text"
            onChange={(e) => {
              setId({
                ...DEFAULT_OPTIONS,
                idec: e.target.value,
                ...(id.index ? { index: id.index } : {}),
              });
            }}
          />
          <span> nebo </span>
          <input
            list="channels"
            value={id.videoId}
            placeholder="videoId (napr. CH_24)"
            type="text"
            onChange={(e) => {
              setId({ ...DEFAULT_OPTIONS, videoId: e.target.value });
            }}
          />
          <datalist id="channels">
            {CHANNELS.map((item) => (
              <option value={item} />
            ))}
          </datalist>
          <span> nebo </span>
          <input
            value={id.live}
            placeholder="live (napr. 24) "
            type="text"
            onChange={(e) => {
              setId({ ...DEFAULT_OPTIONS, live: e.target.value });
            }}
          />
          <span> nebo </span>
          <input
            value={id.bonus}
            placeholder="bonus id"
            type="text"
            onChange={(e) => {
              setId({ ...DEFAULT_OPTIONS, bonus: e.target.value });
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
          <div style={{ margin: "8px 0" }}>
            <input
              id="oldPlayer"
              type="checkbox"
              onChange={(e) => setShowOld(e.target.checked)}
            />
            <label htmlFor="oldPlayer">Zobrazit starý přehrávač</label>
          </div>
          <div
            style={{
              margin: "8px 0",
            }}
          >
            <input
              id="setDebugStreamPausedTimeout"
              value={debugStreamPausedTimeout}
              placeholder="Čas v minutách"
              type="text"
              style={{ maxWidth: 98 }}
              onChange={(e) => {
                setDebugStreamPausedTimeout(e.target.value);
              }}
            />
            <label
              htmlFor="setDebugStreamPausedTimeout"
              style={{ marginLeft: 3 }}
            >
              Refetch playlistů po pauze
            </label>
          </div>
          <div style={{ margin: "8px 0" }}>
            <input
              id="setDebugStreamUrlExpiredTimeout"
              value={debugStreamUrlExpiredTimeout}
              placeholder="Čas v minutách"
              type="text"
              style={{ maxWidth: 98 }}
              onChange={(e) => {
                setDebugStreamUrlExpiredTimeout(e.target.value);
              }}
            />
            <label
              htmlFor="setDebugStreamUrlExpiredTimeout"
              style={{ marginLeft: 3 }}
            >
              Refetch playlistů pro přepínání mezi více stream urls
            </label>
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
            {hasId && (
              <div className={classes.playerWrapper}>
                <IframePlayer
                  id={hasId}
                  src={`${ENVS[previewEnvIndex]}?${queryString}`}
                />
                {showOld && (
                  <>
                    <IframePlayer
                      id={hasId}
                      src={`https://www.ceskatelevize.cz/ivysilani/embed/iFramePlayer.php?${queryString}`}
                    />
                    <a
                      href={`https://www.ceskatelevize.cz/ivysilani/embed/iFramePlayer.php?${queryString}`}
                    >{`https://www.ceskatelevize.cz/ivysilani/embed/iFramePlayer.php?${queryString}`}</a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {hasId && (
          <div>
            {ENVS.map((env) => (
              <div key={env} style={{ margin: "8px 0" }}>
                <a
                  href={`${env}?${queryString}`}
                  target="_blank"
                  rel="noreferrer"
                >{`${env}?${queryString}`}</a>
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
                  setId({
                    ...DEFAULT_OPTIONS,
                    ...(ex.idec ? { idec: ex.idec } : {}),
                    ...(ex.bonus ? { bonus: ex.bonus } : {}),
                    ...(ex.index ? { index: ex.index } : {}),
                  });
                }}
              >
                {ex.index || ex.idec || ex.bonus}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
