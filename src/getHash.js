export async function getHash() {
  const res = await fetch(
    "https://ct24.ceskatelevize.cz/3443926-pres-sto-let-historie-ostravy-je-zaznamenano-v-kronikach-drive-samostatnych-obci",
    {
      cache: "no-store"
    }
  );
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const scripts = Array.from(doc.querySelectorAll("script"));

  const settingsScript = scripts
    .find((script) =>
      script.textContent.includes("jQuery.extend(Drupal.settings,")
    )
    .textContent.trim();

  const hash = settingsScript.split('media_ivysilani:{hash:"')[1].slice(0, 40);
  return hash;
}
