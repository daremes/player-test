const URLS = [
  "https://ct24.ceskatelevize.cz/domaci/3460826-nekula-chce-prosadit-vyssi-podporu-zemedelcum-nedostatek-potravin-podle-nej-nehrozi",
  "https://ct24.ceskatelevize.cz/3443926-pres-sto-let-historie-ostravy-je-zaznamenano-v-kronikach-drive-samostatnych-obci",
  "https://ct24.ceskatelevize.cz/ekonomika/3460144-evropa-s-lng-zaspala-odstrizeni-od-ruskeho-plynu-zaboli-mini-experti",
  "https://ct24.ceskatelevize.cz/ekonomika/3460122-lidri-zemi-eu-se-shodli-na-spolecnych-nakupech-plynu-podle-fialy-je-cilem",
  "https://ct24.ceskatelevize.cz/specialy/rusko-ukrajinsky-konflikt/3459728-spojene-staty-budou-do-evropy-posilat-plyn-rusko-zvazuje",
  "https://ct24.ceskatelevize.cz/kultura/3459594-chrudimske-muzeum-si-posvitilo-na-luminiscencni-loutky-divadlo-blackwits-vzniklo-v",
  "https://ct24.ceskatelevize.cz/kultura/3459548-studio-dva-propira-skandal-s-beckhamem-okolni-svet-umi-byt-hnusnejsi-nez-bulvar-rika",
  "https://ct24.ceskatelevize.cz/domaci/3458224-cesko-nove-poskytuje-uprchlikum-docasnou-ochranu-lide-s-vizy-mohou-pracovat-i",
  "https://ct24.ceskatelevize.cz/domaci/3460532-na-integraci-ukrajinskych-deti-do-skol-bude-do-srpna-potreba-vice-nez-pet-miliard",
  "https://ct24.ceskatelevize.cz/domaci/3460540-sledujte-premier-fiala-je-hostem-otazek-vaclava-moravce",
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export async function getHash() {
  const index = getRandomInt(URLS.length);
  console.info("hash fetched from: ", URLS[index], index);
  const res = await fetch(URLS[index], {
    cache: "no-store",
  });
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const scripts = Array.from(doc.querySelectorAll("script"));

  const settingsScript = scripts
    .find((script) =>
      script.textContent?.includes("jQuery.extend(Drupal.settings,")
    )
    ?.textContent?.trim();

  const hash = settingsScript?.split('media_ivysilani:{hash:"')[1].slice(0, 40);
  return hash || "unknown";
}
