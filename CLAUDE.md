# agentic.schule: Schreibrichtlinie (verbindlich)

Dieses Repo enthält Blog-Artikel, die unter Johannes Hoppes Namen erscheinen. Jeder Artikel muss nach ihm klingen, nicht nach einem Sprachmodell. Die folgenden Regeln beschreiben seinen Stil, hergeleitet aus dem Angular-Buch und den Artikeln auf angular.schule und angular-buch.com. Sie sind bindend.

Die globalen Regeln aus `~/.claude/CLAUDE.md` gelten zusätzlich, besonders: keine LLM-Floskeln, echte Umlaute, keine manuellen Zeilenumbrüche, jede Tatsachenbehauptung an der Primärquelle geprüft.

## Anrede und Perspektive

- **Durchgehend duzen.** Kein „Sie".
- **„ich" für eigene Meinung und Erfahrung, „du" für den Leser, „wir" fürs gemeinsame Erkunden.** Meinung immer als Meinung markieren: „meiner Meinung nach", „meine Vermutung:", „aus meiner Sicht".
- „man" nur für wirklich Allgemeingültiges.

## Satzbau

- **Kurze, parataktische Sätze. Ein Gedanke pro Satz.** Lieber zwei kurze Sätze als einen mit drei Nebensätzen.
- Wenig Kommas. Reihung mit „und" statt Kommaketten.
- **Doppelpunkt-Enthüllung als Signatur-Stilmittel:** eine Aussage aufmachen, dann sofort konkret einlösen. „Die Antwort liegt in einer Designentscheidung: Das Terminal zwingt zu radikaler Einfachheit."

## Aufbau eines Artikels

- **Fette These direkt nach dem Frontmatter**, ein Absatz, der den Kern vorwegnimmt. Danach `## Inhalt` (bzw. `## Contents`) mit `[[toc]]`.
- **Beginne mit dem „Warum".** Erst die Motivation oder das Problem, dann der Weg dahin, dann das Fazit. Die konkrete Form richtet sich nach dem Artikeltyp: ein Tutorial läuft Schritt für Schritt, ein Meinungsstück von Problem zu Lösung, ein Überblick Thema für Thema. Kein festes Schema erzwingen.
- Optionale Mittel für Meinungs- und Deep-Dive-Artikel: gescheiterte Versuche durchspielen, bevor die Lösung kommt, oder Varianten als nummerierte „Idee 1 … Idee 5" gegenüberstellen. Kein Muss.
- **Brückensätze am Sektionsende**, die die nächste Sektion ankündigen. „Doch bei aller Begeisterung: Claude Code ist nicht perfekt."
- **Überschriften als Frage, Imperativ/Infinitiv oder „Thema: Untertitel".** „Warum ein Terminal?", „Den MCP-Server einrichten", „Herausforderung: veraltetes Wissen". Kapitel schließen mit „Fazit" oder „Was haben wir gelernt?".
- **Abschluss:** persönliches Urteil plus Handlungsaufruf („Fang einfach an."), danach Feedback-Einladung und eine Danksagung in `<small>`.

## Ton: ehrlich statt werblich

- Begeisterung ja, Hype nein. **Transparenz ist wichtiger als Werbung.** Zu jedem gelobten Werkzeug gehört eine ehrliche Schwächen-Sektion und die offenen Trade-offs.
- **Gehedgt statt behauptet:** „in der Regel", „meist", „typischerweise". Keine unbelegten Superlative.
- **Jede starke Aussage wird belegt** (Quelle, Link, Zeilennummer, Issue). Was sich nicht belegen lässt, wird als unbestätigt markiert oder fliegt raus.
- **Sparsam mit Zahlen.** Nie Zahlen zur Ausschmückung streuen („über achtzig Prozesse", „mehrere hundert Prozent CPU", „eine halbe Stunde"). Eine konkrete Zahl gehört nur in den Text, wenn sie fürs Verständnis wirklich, wirklich wichtig und belegt ist. Sonst qualitativ formulieren („stapeln sich", „lasten die CPU aus", „wächst immer weiter").
- Dosierter, trockener Humor und Selbstironie sind erwünscht, nie albern. Personifikation zur Erklärung ist gut („Der Agent hat kein Ego und erklärt geduldig").
- **Der Autor tritt stets souverän auf, wie ein Profi, der die Dinge im Griff hat.** Erkenntnisse sind Wissen und Können, keine Zufallsfunde oder mühsam erlittenen Lektionen. Tabu sind „mir ist das passiert", „das hat mich Ärger gekostet", „erst beim zweiten Mal habe ich die Ursache verstanden", „meine erste, naive Intuition war …". Solche Pannen-Erzählungen wirken dilettantisch. Fallen werden als Wissen präsentiert („das ist eine Falle: …"), das eigene Hineintappen bleibt draußen. Trockene Selbstironie und klar markierte Vorlieben („ich bevorzuge …") bleiben ausdrücklich erwünscht.
- **Das Wort „ehrlich" nicht in den Artikeltext schreiben.** Der Autor liefert Fakten, die sind ohnehin ehrlich. Sich selbst als „ehrlich" zu markieren, legt nahe, es gäbe auch unehrliche oder geschönte Aussagen. Die Sache direkt benennen („das räumt nur auf, behebt aber die Ursache nicht") statt sie mit „ehrlich bleibt" oder „ehrliche Grenze" zu etikettieren. Transparenz zeigt sich im Inhalt, nicht im Etikett.

## Fachsprache und Code

- **Englische Fachbegriffe bleiben englisch**, bei Erstnennung kursiv und kurz deutsch erklärt: „den JIT-Modus (Just-in-Time)", „(engl. *Context Summarization*)". Akronyme bei Erstnennung ausschreiben.
- API-Namen und Befehle in Inline-Code (`rxResource()`, `/loop`). Bindestrich-Kopplung hält englische Begriffe deutsch-grammatisch: „MCP-Server", „AI-Agenten".
- **Code als Vorher/Nachher** mit sprechenden Kommentaren und `❌`/`✅` für falsch/richtig. Eine durchgehende Beispiel-Domäne (im Buch: BookMonkey).
- Alltagsmetaphern, um Technik greifbar zu machen: „Stell es dir so vor: …".

## Gedankenstrich, Antithese, Floskeln

- **Kein Gedankenstrich-Einschub als Stilmittel.** Statt eines dramatischen Strichs entweder zwei ganze Sätze oder ein Semikolon. Ein Strich ist ganz selten erlaubt, wenn er sich wirklich anbietet; die Länge des Strichs ist egal. Der Grund: der Gedankenstrich gilt heute als typisches LLM-Zeichen.
- **Keine „nicht X, sondern Y"-Antithese als rhetorischer Effekt.** Als rein sachliche Technik-Aussage ist „nicht permanent, sondern nur bei Bedarf" in Ordnung.
- Keine Zusammenfassungs- und Autoritätsfloskeln („Kurz gesagt" als Deckel, „Es ist wichtig zu verstehen", „In einer Welt, in der …"). Signalphrasen wie „Konkret heißt das:", „Die gute Nachricht:", „Die Lösung:" sind dagegen echter Teil des Stils.

## Emojis und Kästen

- **Emojis funktional und sparsam,** nie als Deko-Streusel: `🇩🇪`/`🇬🇧` für den Sprachlink, `⚠️` Warnung, `💡`/`ℹ️` Info, `❌`/`✅` falsch/richtig, gelegentlich `😅`/`😎` für Selbstironie.
- Hinweise als Blockquote-Callout mit Präfix: `> **💡 Tipp:**`, `> **⚠️ Achtung:**`, `> **❌ Fehlermeldung:**`.

## Lieblingswörter

„elegant", „übrigens", „sogenannt", „keine Sorge", „Doch"/„Aber" als Pivot-Satzanfang. Rhetorische Frage als Übergang, die sofort beantwortet wird: „Warum hilft das? Weil …".

## Zweisprachigkeit

Viele Artikel liegen in zwei Ordnern (`-DE`/`-EN`). Beide Fassungen bleiben strukturgleich (gleiche Überschriften, gleiche Reihenfolge). Zitate aus englischen Quellen bleiben in beiden Fassungen zeichengenau im Original.
