import { useEffect, useState } from "react";
import { getHash } from "../utils/getHash";
import IframePlayer from "../components/IframePlayer";
import { createUseStyles } from "react-jss";
import { FaPlay } from "react-icons/fa";

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
  idInput: {
    margin: 2,
  },
  categoryWrapper: {
    margin: [8, 0],
  },
  categoryTitle: {
    textTransform: "uppercase",
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  exampleWrapper: { display: "flex", margin: [8, 0] },
  exampleDescription: { fontSize: 14, padding: [0, 8] },
  exampleTitle: {},
  exampleId: { color: "#666" },
  playButton: {
    border: "#000",
    borderRadius: 4,
    background: "#666",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    cursor: "pointer",
  },
  link: {
    fontSize: 14,
    color: "#111",
    wordWrap: "break-word",
  },
});

const EXAMPLES = [
  {
    title: "Rapstory 1/10",
    type: "Reklamy i pro Safari",
    idec: "220562280010001",
    videoTitle: "Rapstory 1/10",
    showId: "1234",
  },
  {
    title: "Novinarky",
    type: "Bonus",
    bonus: "42128",
    videoTitle: "Novinářky",
    showId: "1234",
  },
  {
    title: "Pouze audio",
    type: "Audio only",
    bonus: "32433",
    videoTitle: "1968: Dnes před 50 lety",
    showId: "12171864678",
  },
  {
    title: "Princip slasti 1/10",
    type: "Dabing, puvodni zneni, AD, titulky",
    idec: "417233100051001",
    videoTitle: "Princip slasti 1/10",
    showId: "1234",
  },
  {
    title: "Princip slasti",
    type: "18+ labeling soucasti playlistu",
    idec: "219254002211001",
    videoTitle: "Princip slasti 1/10",
    showId: "1234",
  },
  {
    title: "Mimořádné pořady ČT24 1. březen",
    type: "Indexy",
    idec: "222411033230301",
    videoTitle: "Mimořádné pořady ČT24 1. březen",
    showId: "1234",
  },
  {
    title: "Světy Jindřicha Chalupeckého",
    type: "Jeden index",
    // idec: "2222041120000120318",
    index: "900837",
    videoTitle: "Světy Jindřicha Chalupeckého",
    showId: "1234",
  },
  {
    title: "Vrazedne stiny ep 2",
    type: "Labeling soucasti vastu",
    idec: "220512120060002",
    videoTitle: "Vražedné stíny 2/10",
    showId: "1234",
  },
  {
    title: "Studio kamarad",
    type: "Vicenasobny playlist/indexy",
    idec: "222553110020020",
    videoTitle: "Nevim",
    showId: "1234",
  },
  {
    title: "Wifina",
    type: "Vicenasobny playlist/indexy",
    idec: "222553112050019",
    videoTitle: "Nevim",
    showId: "1234",
  },
  {
    title: "Neco",
    type: "Vicenasobny playlist/indexy",
    idec: "322291310020006",
    videoTitle: "Nevim",
    showId: "1234",
  },
  {
    title: "Cyklotoulky",
    type: "Audio description",
    idec: "221471292050042",
    videoTitle: "Cyklotoulky Opava",
    showId: "1234",
  },
  {
    title: "Angličtina s Hurvínkem",
    type: "Audio description",
    idec: "214542157910035",
    videoTitle: "Angličtina s Hurvínkem",
    showId: "1234",
  },
  {
    title: "Klobouček / Dan Bárta trio",
    type: "Pouze jedna kvalita",
    idec: "21154215446",
    videoTitle: "Klobouček / Dan Bárta trio",
    showId: "1234",
  },
  {
    title: "Země orlů",
    type: "Omezeny set kvalit",
    idec: "26153232260",
    videoTitle: "Země orlů",
    showId: "1234",
  },
  {
    title: "Písničky pro pamětníky",
    type: "Bez FullHD",
    idec: "27832024069",
    videoTitle: "Písničky pro pamětníky",
    showId: "1234",
  },
  {
    title: "Pocasi",
    type: "Video pod 5min",
    idec: "206411000400124",
    videoTitle: "Pocasi",
    showId: "1234",
  },
  {
    title: "O pohár prezidenta ČTS",
    type: "Video nad 5h",
    idec: "220471291352003",
    videoTitle: "O pohár prezidenta ČTS",
    showId: "1234",
  },
  {
    title: "Území strachu",
    type: "4:3 aspect ratio",
    idec: "28631033712",
    videoTitle: "Území strachu",
    showId: "1234",
  },
  {
    title: "Kosovo - krev není voda",
    type: "Non-provys",
    idec: "21225100058",
    videoTitle: "Kosovo - krev není voda",
    showId: "1234",
  },
  {
    title: "168 hodiny",
    type: "Closed captions",
    idec: "222452801100410",
    videoTitle: "10. duben",
    showId: "10117034229",
  },
  {
    title: "168 hodin",
    type: "Closed captions",
    idec: "222452801100403",
    videoTitle: "3. duben",
    showId: "10117034229",
  },
  {
    title: "168 hodin",
    type: "Closed captions",
    idec: "222452801100327",
    videoTitle: "27. březen",
    showId: "10117034229",
  },
];

const getCategorized = () => {
  const categories: string[] = [];
  const categorized: any[] = [];
  EXAMPLES.forEach((example) => {
    if (!categories.includes(example.type)) {
      categories.push(example.type);
      const sameType = EXAMPLES.filter((ex) => ex.type === example.type);
      categorized.push(sameType);
    }
  });
  return categorized;
};

const categorized = getCategorized();

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
  const hasId = id.idec || id.live || id.bonus || id.videoId || id.index;
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
            className={classes.idInput}
            value={id.idec}
            placeholder="idec"
            type="text"
            onChange={(e) => {
              setId({
                ...DEFAULT_OPTIONS,
                idec: e.target.value,
              });
            }}
          />
          <input
            className={classes.idInput}
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
              <option key={item} value={item} />
            ))}
          </datalist>
          <input
            className={classes.idInput}
            value={id.bonus}
            placeholder="bonus id"
            type="text"
            onChange={(e) => {
              setId({ ...DEFAULT_OPTIONS, bonus: e.target.value });
            }}
          />
          <input
            className={classes.idInput}
            value={id.index}
            placeholder="index id"
            type="text"
            onChange={(e) => {
              setId({ ...DEFAULT_OPTIONS, index: e.target.value });
            }}
          />
          <input
            className={classes.idInput}
            value={id.live}
            placeholder="live (napr. 24) "
            type="text"
            onChange={(e) => {
              setId({ ...DEFAULT_OPTIONS, live: e.target.value });
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
          <div style={{ margin: "8px 0" }}>
            <a
              className={classes.link}
              href={`${ENVS[envIndex]}?${queryString}`}
              target="_blank"
              rel="noreferrer"
            >{`${ENVS[envIndex]}?${queryString}`}</a>
          </div>
        )}
        <div style={{ marginTop: 32 }}>
          {categorized.map((category) => (
            <div
              className={classes.categoryWrapper}
              key={JSON.stringify(category)}
            >
              <div className={classes.categoryTitle}>{category[0].type}</div>
              {category.map((ex: any) => (
                <div
                  className={classes.exampleWrapper}
                  key={ex.idec || ex.bonus || ex.index}
                >
                  <button
                    className={classes.playButton}
                    onClick={() => {
                      setId({
                        ...DEFAULT_OPTIONS,
                        ...(ex.idec ? { idec: ex.idec } : {}),
                        ...(ex.bonus ? { bonus: ex.bonus } : {}),
                        ...(ex.index ? { index: ex.index } : {}),
                      });
                    }}
                  >
                    <FaPlay color="#fafafa" />
                  </button>
                  <div className={classes.exampleDescription}>
                    <div>{ex.title}</div>
                    <div>
                      <div className={classes.exampleId}>
                        {`${ex.idec ? `idec ${ex.idec}` : ""}`}
                        {`${ex.bonus ? `bonus ${ex.bonus}` : ""}`}
                        {`${ex.index ? `index ${ex.index}` : ""}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
