export type Street = { id: string; name: string; mood: string; description: string; shops: string[] };
export type ShopItem = { id: string; name: string; price: number; effect: string };
export type Shop = { id: string; name: string; streetId: string; tagline: string; items: ShopItem[] };
export type Scenario = {
  id: string;
  title: string;
  streetId: string;
  intensity: "soft" | "media";
  summary: string;
  roles: string[];
  prompts: string[];
  boundaries: string[];
};

export const SAFEWORD_DEFAULT = "ROSSO";
export const STARTING_SIGILLI = 100;
export const MAX_PLAYERS = 6;

export const streets: Street[] = [
  { id: "via-velluto", name: "Via del Velluto", mood: "ambra e jazz", description: "Il viale principale: locali, vetrine e il Salotto d'ingresso.", shops: ["maison-prugna", "bar-ambra"] },
  { id: "vicolo-sigilli", name: "Vicolo dei Sigilli", mood: "mistero", description: "Un vicolo di cera e lanterne dove si scambiano buste e patti.", shops: ["cerasigillo"] },
  { id: "piazza-ambra", name: "Piazza Ambra", mood: "festa", description: "La piazza sociale: musica, tavoli e incontri tra la crew.", shops: ["gelateria-notte", "atelier-maschere"] },
  { id: "passage-lume", name: "Passage Lume", mood: "notte lenta", description: "Un passaggio coperto illuminato da lampade, tranquillo e riservato.", shops: ["libreria-lume"] },
];

export const shops: Shop[] = [
  { id: "maison-prugna", name: "Maison Prugna", streetId: "via-velluto", tagline: "Abiti e accessori per l'avatar.", items: [
    { id: "giacca-velluto", name: "Giacca di velluto", price: 40, effect: "Stile avatar" },
    { id: "guanti-seta", name: "Guanti di seta", price: 25, effect: "Stile avatar" },
  ] },
  { id: "bar-ambra", name: "Bar Ambra", streetId: "via-velluto", tagline: "Bevande analcoliche e atmosfera.", items: [
    { id: "spritz-zero", name: "Spritz zero", price: 8, effect: "Emote brindisi" },
    { id: "te-ambra", name: "Tè d'ambra", price: 6, effect: "Recupera calma" },
  ] },
  { id: "cerasigillo", name: "Cerasigillo", streetId: "vicolo-sigilli", tagline: "Sigilli personali e buste.", items: [
    { id: "sigillo-prugna", name: "Sigillo prugna", price: 30, effect: "Firma profilo" },
    { id: "busta-invito", name: "Busta d'invito", price: 12, effect: "Invita un amico adulto nella sessione" },
  ] },
  { id: "gelateria-notte", name: "Gelateria Notte", tagline: "Dolci per le pause.", streetId: "piazza-ambra", items: [
    { id: "gelato-fico", name: "Gelato al fico", price: 7, effect: "Emote relax" },
  ] },
  { id: "atelier-maschere", name: "Atelier Maschere", streetId: "piazza-ambra", tagline: "Maschere e identità di scena.", items: [
    { id: "maschera-volpe", name: "Maschera volpe", price: 35, effect: "Stile avatar" },
    { id: "maschera-luna", name: "Maschera luna", price: 35, effect: "Stile avatar" },
  ] },
  { id: "libreria-lume", name: "Libreria Lume", streetId: "passage-lume", tagline: "Racconti e carte-scenario.", items: [
    { id: "carta-scena", name: "Carta scenario", price: 15, effect: "Sblocca una domanda extra" },
  ] },
];

export const scenarios: Scenario[] = [
  { id: "anticamera", title: "L'Anticamera", streetId: "via-velluto", intensity: "soft", summary: "Il patto della soglia: dichiarate un limite e una safeword prima di entrare.", roles: ["Ospite", "Custode"], prompts: ["Quale parte della serata deve restare intoccabile?", "Qual è il segnale che usi per fermarti?"], boundaries: ["Solo fiction", "Nessun contenuto esplicito"] },
  { id: "tango-notturno", title: "Tango notturno", streetId: "piazza-ambra", intensity: "soft", summary: "Un ballo lento in piazza: flirt leggero, complicità e musica.", roles: ["Ballerino", "Ballerina", "Spettatore"], prompts: ["Che musica sceglieresti?", "Come inizia il primo passo?"], boundaries: ["Flirt non esplicito", "Si può dire no in ogni momento"] },
  { id: "lettera-sigillata", title: "La lettera sigillata", streetId: "vicolo-sigilli", intensity: "media", summary: "Un giallo sentimentale: ogni giocatore custodisce un pezzo di segreto.", roles: ["Mittente", "Detective", "Confidente"], prompts: ["Cosa c'è scritto nella lettera?", "Chi ha rotto il sigillo?"], boundaries: ["Tensione narrativa, non esplicita", "Niente informazioni personali reali"] },
  { id: "salotto-lume", title: "Salotto Lume", streetId: "passage-lume", intensity: "media", summary: "Conversazioni adulte a luci basse: desideri, fantasie dichiarate e limiti.", roles: ["Narratore", "Ospite"], prompts: ["Qual è una fantasia che resta fiction?", "Quale limite vuoi ribadire?"], boundaries: ["Consenso reciproco continuo", "Nessun contenuto esplicito"] },
];

export const forbiddenTerms = ["minorenne", "minorenni", "under 18", "under18", "teen", "bambin"];

export function isSafeText(text: string): boolean {
  const t = text.toLowerCase();
  return !forbiddenTerms.some(term => t.includes(term));
}
