import { useEffect, useRef, useState } from "react";
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

const ORIGINS = ["decko", "ivysilani", "artzona", "ct24", "ct4", "ctedu"];

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
  popup: {
    position: "fixed",
    bottom: 0,
    right: 0,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
  },
  popupInner: {
    padding: 8,
  },
});

enum ExampleTypesEnum {
  cc = "Closed captions",
  audioOnly = "Audio only",
  audioDescription = "Audio description",
  labeling = "Labeling",
  indexy = "Indexy",
  index = "Konkrétní index",
  reklamy = "Reklamy",
  bonus = "Bonus",
  complexVOD = "Audio stopy, titulky, AD, labeling",
  vicenasobnyPlaylist = "Vícenásobný playlist",
  kvality = "Kvality",
  ostatni = "Ostatní",
}

type Example = {
  title: string;
  type: ExampleTypesEnum;
  videoTitle: string;
  showId: string;
  idec?: string;
  index?: string;
  bonus?: string;
};

const EXAMPLES: Example[] = [
  {
    title: "Princip slasti 1/10",
    type: ExampleTypesEnum.complexVOD,
    idec: "417233100051001",
    videoTitle: "Princip slasti 1/10",
    showId: "1234",
  },
  {
    title: "Princip slasti",
    type: ExampleTypesEnum.labeling,
    idec: "219254002211001",
    videoTitle: "Princip slasti 1/10",
    showId: "1234",
  },
  {
    title: "1968: Dnes před 50 lety",
    type: ExampleTypesEnum.audioOnly,
    bonus: "32433",
    videoTitle: "1968: Dnes před 50 lety",
    showId: "12171864678",
  },
  {
    title: "Horem pádem",
    type: ExampleTypesEnum.audioOnly,
    bonus: "31839",
    videoTitle: "Jak „vydejchává“ manželka vaše milenecké scény?",
    showId: "12171864678",
  },
  {
    title: "Novinarky",
    type: ExampleTypesEnum.bonus,
    bonus: "42128",
    videoTitle: "Novinářky",
    showId: "1234",
  },
  {
    title: "Mimořádné pořady ČT24 1. březen",
    type: ExampleTypesEnum.indexy,
    idec: "222411033230301",
    videoTitle: "Mimořádné pořady ČT24 1. březen",
    showId: "1234",
  },
  {
    title: "Světy Jindřicha Chalupeckého",
    type: ExampleTypesEnum.index,
    // idec: "2222041120000120318",
    index: "900837",
    videoTitle: "Světy Jindřicha Chalupeckého",
    showId: "1234",
  },
  {
    title: "Vrazedne stiny ep 2",
    type: ExampleTypesEnum.labeling,
    idec: "220512120060002",
    videoTitle: "Vražedné stíny 2/10",
    showId: "1234",
  },
  {
    title: "Studio kamarad",
    type: ExampleTypesEnum.vicenasobnyPlaylist,
    idec: "222553110020020",
    videoTitle: "Nevim",
    showId: "1234",
  },
  {
    title: "Wifina",
    type: ExampleTypesEnum.vicenasobnyPlaylist,
    idec: "222553112050019",
    videoTitle: "Nevim",
    showId: "1234",
  },
  {
    title: "Neco",
    type: ExampleTypesEnum.vicenasobnyPlaylist,
    idec: "322291310020006",
    videoTitle: "Nevim",
    showId: "1234",
  },
  {
    title: "Cyklotoulky",
    type: ExampleTypesEnum.audioDescription,
    idec: "221471292050042",
    videoTitle: "Cyklotoulky Opava",
    showId: "1234",
  },
  {
    title: "Angličtina s Hurvínkem",
    type: ExampleTypesEnum.audioDescription,
    idec: "214542157910035",
    videoTitle: "Angličtina s Hurvínkem",
    showId: "1234",
  },
  {
    title: "Reklamy i pro Safari: Rapstory 1/10",
    type: ExampleTypesEnum.reklamy,
    idec: "220562280010001",
    videoTitle: "Rapstory 1/10",
    showId: "1234",
  },
  {
    title: "Pouze jedna kvalita: Dan Bárta trio",
    type: ExampleTypesEnum.kvality,
    idec: "21154215446",
    videoTitle: "Klobouček / Dan Bárta trio",
    showId: "1234",
  },
  {
    title: "Omezeny set kvalit: Země orlů",
    type: ExampleTypesEnum.kvality,
    idec: "26153232260",
    videoTitle: "Země orlů",
    showId: "1234",
  },
  {
    title: "Bez FullHD: Písničky pro pamětníky",
    type: ExampleTypesEnum.kvality,
    idec: "27832024069",
    videoTitle: "Písničky pro pamětníky",
    showId: "1234",
  },
  {
    title: "168 hodiny",
    type: ExampleTypesEnum.cc,
    idec: "222452801100410",
    videoTitle: "10. duben",
    showId: "10117034229",
  },
  {
    title: "168 hodin",
    type: ExampleTypesEnum.cc,
    idec: "222452801100403",
    videoTitle: "3. duben",
    showId: "10117034229",
  },
  {
    title: "168 hodin",
    type: ExampleTypesEnum.cc,
    idec: "222452801100327",
    videoTitle: "27. březen",
    showId: "10117034229",
  },
  {
    title: "Video pod 5min: Pocasi",
    type: ExampleTypesEnum.ostatni,
    idec: "206411000400124",
    videoTitle: "Pocasi",
    showId: "1234",
  },
  {
    title: "Video nad 5h: O pohár prezidenta ČTS",
    type: ExampleTypesEnum.ostatni,
    idec: "220471291352003",
    videoTitle: "O pohár prezidenta ČTS",
    showId: "1234",
  },
  {
    title: "4:3 aspect ratio: Území strachu",
    type: ExampleTypesEnum.ostatni,
    idec: "28631033712",
    videoTitle: "Území strachu",
    showId: "1234",
  },
  {
    title: "Non-provys: Kosovo - krev není voda",
    type: ExampleTypesEnum.ostatni,
    idec: "21225100058",
    videoTitle: "Kosovo - krev není voda",
    showId: "1234",
  },
];

const getCategorized = () => {
  const categories: string[] = [];
  const categorized: { type: string; items: Example[] }[] = [];
  EXAMPLES.forEach((example) => {
    if (!categories.includes(example.type)) {
      categories.push(example.type);
      const sameTypeItems = EXAMPLES.filter((ex) => ex.type === example.type);
      categorized.push({ type: example.type, items: sameTypeItems });
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
  const anchorRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    const relevant = EXAMPLES.find(
      (ex) =>
        ex.idec === id.idec || ex.bonus === id.bonus || ex.index === id.index
    );
    if (id.live || !relevant) {
      setVideoTitle("");
      setShowId("");
      return;
    }
    setVideoTitle(relevant.videoTitle);
    setShowId(relevant.showId);
  }, [id.bonus, id.idec, id.live, id.index]);

  const scrollToVideo = () => {
    if (!anchorRef.current) {
      return;
    }
    anchorRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // const refreshHash = useCallback(() => {
  //   const hash = getHash();
  //   if (hash !== previousHash.current) {
  //     previousHash.current = hash;
  //     setHash(hash);
  //     console.info("Iframe hash has just been refreshed:", hash);
  //   }
  //   console.log(".");
  // }, []);

  const parameters = {
    autoStart: autoplay,
    ...(id.videoId ? { videoId: id.videoId } : {}),
    ...(id.live ? { live: id.live } : {}),
    ...(id.idec ? { IDEC: id.idec } : {}),
    ...(id.bonus ? { bonus: id.bonus } : {}),
    ...(id.index ? { index: id.index } : {}),
    ...(showId ? { sidp: showId } : {}),
    ...(origin ? { origin } : {}),
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
    <>
      <div className={classes.container}>
        <div className={classes.content}>
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
            <div>
              <input
                className={classes.idInput}
                list="origin"
                value={origin}
                placeholder="origin (default=iVysilani)"
                type="text"
                onChange={(e) => {
                  setOrigin(e.target.value);
                }}
              />
              <datalist id="origin">
                {ORIGINS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
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
              <div ref={anchorRef} />
              {hasId && (
                <div className={classes.playerWrapper}>
                  <IframePlayer
                    id={hasId}
                    src={`${ENVS[previewEnvIndex]}?${queryString}`}
                  />
                </div>
              )}
              {showOld && (
                <div className={classes.playerWrapper}>
                  <IframePlayer
                    id={hasId}
                    src={`https://www.ceskatelevize.cz/ivysilani/embed/iFramePlayer.php?${queryString}&hash=${getHash()}`}
                  />
                  <a
                    href={`https://www.ceskatelevize.cz/ivysilani/embed/iFramePlayer.php?${queryString}&hash=${getHash()}`}
                  >{`https://www.ceskatelevize.cz/ivysilani/embed/iFramePlayer.php?${queryString}&hash=${getHash()}`}</a>
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
                <div className={classes.categoryTitle}>{category.type}</div>
                {category.items.map((ex) => (
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
                        scrollToVideo();
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
    </>
  );
}
