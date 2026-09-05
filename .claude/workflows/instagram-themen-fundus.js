export const meta = {
  name: 'instagram-themen-fundus',
  description: 'Gespeicherte Instagram-Posts transkribieren und zum gruppierten Themen-Fundus mit Abarbeitungs-Checkliste bündeln',
  whenToUse: 'Wenn aus der gesammelten Instagram-Aktivität eine sortierte Themenliste für neue Artikel entstehen soll.',
  phases: [
    { title: 'Transkribieren', detail: 'ein Agent je Block, streng nacheinander (ein geteilter Browser)' },
    { title: 'Bündeln', detail: 'Themen gruppieren und ~/Shots/themen-fundus.md schreiben' },
  ],
}

// args: { total: number, chunkSize: number, runDate: 'YYYY-MM-DD' }
// total = Anzahl der Einträge in ~/Shots/instagram-posts.json (Workflow-Skripte haben keinen Dateizugriff).

const RESULTS_SCHEMA = {
  type: 'object',
  required: ['results'],
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['url', 'account', 'date', 'ok', 'topics', 'essence'],
        properties: {
          url: { type: 'string' },
          account: { type: 'string' },
          date: { type: 'string' },
          ok: { type: 'boolean', description: 'true wenn ein Transkript gewonnen wurde' },
          topics: { type: 'array', items: { type: 'string' }, description: '2-4 Themen-Schlagworte, deutsch, kleingeschrieben' },
          essence: { type: 'string', description: '1-2 Sätze: Kernaussage des Reels, deutsch' },
        },
      },
    },
  },
}

const total = args.total
const chunkSize = args.chunkSize
const chunks = []
for (let start = 0; start < total; start += chunkSize) {
  chunks.push([start, Math.min(start + chunkSize, total) - 1])
}

phase('Transkribieren')
log(`${total} Posts in ${chunks.length} sequenziellen Blöcken (ein geteilter Browser)`)

const allResults = []
let okCount = 0
for (let c = 0; c < chunks.length; c++) {
  const [from, to] = chunks[c]
  const chunkFile = `~/Shots/transcripts/chunk-${String(c + 1).padStart(2, '0')}.md`
  const r = await agent(`Du verarbeitest gespeicherte Instagram-Posts zu Transkripten. Arbeite die Posts mit Index ${from} bis ${to} (0-basiert, inklusiv) aus der Datei ~/Shots/instagram-posts.json ab (Read; die Datei ist ein JSON-Array mit url, account, date, caption, source).

Für JEDEN Post in deinem Bereich, einen nach dem anderen:
1. Navigiere mit mcp__playwright__browser_navigate zu https://www.transcript365.com/free/instagram-transcript/ (Tool-Schemas bei Bedarf per ToolSearch "select:mcp__playwright__browser_navigate,mcp__playwright__browser_evaluate,mcp__playwright__browser_wait_for" laden).
2. Trage die Reel-URL ins Feld ein und starte. Das Eingabefeld ist ein React-Input, ein simples value-Setzen reicht NICHT. Erprobtes Rezept per mcp__playwright__browser_evaluate:
   () => { const inp = document.querySelector('#url-input'); const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; setter.call(inp, 'REEL_URL_HIER'); inp.dispatchEvent(new Event('input', {bubbles: true})); const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Generate Free Transcript')); btn.click(); return 'ok'; }
3. Warte mit mcp__playwright__browser_wait_for 15 Sekunden, dann lies per browser_evaluate document.body.innerText und suche den Ergebnisblock: Er beginnt nach "Translate" mit Account-Name/Handle, Caption, Metadaten (Views, Likes, Duration, Channel ID, Video ID) und dem "AI Transcript" mit Zeitstempeln. Falls noch kein Transkript da ist, warte weitere 10 Sekunden und lies erneut (maximal 3 Versuche).
4. Scheitert ein Post (Fehlermeldung, Limit, privates/gelöschtes Reel, kein Video): notiere den Grund, versuche es NICHT endlos, gehe zum nächsten Post. Nutze dann die caption aus der JSON als Grundlage für topics/essence und setze ok=false.

Sammle die Ergebnisse und schreibe sie per Write ALLE in EINE Datei ${chunkFile} (Verzeichnis wird automatisch angelegt). Format pro Post:
## <Account> — <Datum> — <URL>
**Metadaten:** Handle, Views/Likes falls vorhanden, Dauer
**Caption:** <Caption aus JSON, gekürzt auf das Wesentliche>
**Transkript:** <das volle Transkript mit Zeitstempeln, oder "KEIN TRANSKRIPT: <Grund>">

Wichtige Regeln: Nur aus dem tatsächlich Gesehenen berichten, nie Transkripte erfinden. Deutsche Reels bleiben deutsch, englische englisch. Der geteilte Browser gehört in diesem Moment dir allein, öffne keine zusätzlichen Tabs.

Gib als StructuredOutput für jeden Post zurück: url, account (aus JSON oder Tool), date, ok, topics (2-4 deutsche Schlagworte, z. B. "kontextfenster", "vibe coding", "lokale ki"), essence (1-2 Sätze Kernaussage, deutsch).`, {
    label: `transkript:${from}-${to}`,
    phase: 'Transkribieren',
    schema: RESULTS_SCHEMA,
    // Mechanische Browser-Arbeit nach festem Rezept: dafür genügt das kleinere Modell,
    // und die Sitzung läuft nicht gegen ihr Limit.
    model: 'sonnet',
  })
  if (r && r.results) {
    allResults.push(...r.results)
    okCount += r.results.filter(x => x.ok).length
    log(`Block ${c + 1}/${chunks.length}: ${r.results.filter(x => x.ok).length}/${r.results.length} Transkripte, gesamt ${okCount}`)
  } else {
    log(`Block ${c + 1}/${chunks.length}: Agent lieferte kein Ergebnis`)
  }
}

phase('Bündeln')
const fundus = await agent(`Erstelle den Themen-Fundus aus Johannes' Instagram-Aktivität (hauptsächlich KI-Themen, ${args.runDate}). Hier die kompakten Analysen aller ${allResults.length} Posts (davon ${okCount} mit Transkript; die Volltranskripte liegen in ~/Shots/transcripts/chunk-*.md, bei Bedarf per Read nachschlagen):

${JSON.stringify(allResults)}

Schreibe per Write die Datei ~/Shots/themen-fundus.md, auf Deutsch, mit echten Umlauten und ohne harte Zeilenumbrüche:

1. Kopf: Titel, eine Zeile Herkunft (Instagram-Export, gespeicherte Posts und Likes, Zeitraum, Anzahl, davon mit Transkript, Verweis auf ~/Shots/transcripts/), Stand ${args.runDate}.
2. Dann die THEMEN-GRUPPEN: Gruppiere die Posts nach inhaltlicher Ähnlichkeit in sinnvolle Cluster (z. B. Context Engineering, Vibe Coding, Claude Code, lokale KI, Agenten-Werkzeuge, KI-Sicherheit, Web-Dev, Sonstiges — bilde die Gruppen aus den Daten, nicht aus dieser Liste). Pro Gruppe: ## Überschrift, ein Satz, worum es im Cluster geht, dann pro Post eine Zeile: "- **Essenz in einem Halbsatz** — @account, Datum, [Reel](url)" plus Marker "(ohne Transkript)" falls ok=false. Sortiere Gruppen nach Größe, Posts innerhalb nach Datum absteigend.
3. Am Ende: ## Abarbeitung — eine kurze Checkliste der Gruppen zum Abhaken (- [ ] Gruppe: mögliche Artikel-Idee in einem Halbsatz), als Startpunkt für die strukturierte Abarbeitung.

Erfinde nichts hinzu; jede Zeile stützt sich auf essence/topics/caption der Daten. Gib als Text ein kurzes Fazit zurück: Anzahl Gruppen, die drei größten, Auffälligkeiten.`, {
  label: 'themen-fundus',
  phase: 'Bündeln',
})

return {
  posts: allResults.length,
  mitTranskript: okCount,
  fundus: '~/Shots/themen-fundus.md',
  transkripte: '~/Shots/transcripts/',
  fazit: fundus,
}
