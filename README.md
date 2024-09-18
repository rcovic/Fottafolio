Pagina React per il Fottafolio, strumento per tenere lo storico dei vari calcetti e gestire le statistiche in modo dinamico e pratico. 
Backend fatto con la libreria python Flask, Frontend con il framework React. 
Come DB ho usato un SQLlite essendo gratuito e non avendo bisogno di tenere una quantità enorme di dati. 

## Funzionalità presenti ad oggi:
- Aggiunta nuovi giocatori nel "roster"
- Aggiunta di nuove partite nel calendario
- Storico partite
- Statistiche di squadra
- Statistiche individuali

### TODO:
- Statistiche avanzate (Es: wr per coppie, wr per campo, wr per tipologia di campo, filtri stat mensili ecc)
- Valutatore formazioni con AI 
- Migliorare GUI rendendola più bella
- Possibilità di inserire foto/video per partita
- Scheda giocatorie
- hosting su sito
- technical things (refractoring codice + refractoring classi ecc ) ..

### Prerequisiti per installarlo:
- Python
- Node.js (ed npm)

```python ./main.py ``` per fare partire il backend (attualmente su localhost:5000) <br>
```npm install ``` per installare le dipendenze contenute in package-json <br>
```npm start ``` per fare partire il frontend (su localhost:3000) <br>

Verrà creata una cartella node modules NON COMMITTARE LA CARTELLA NODE MODULES  (ci dovrebbe essere un git ignore). 
si consiglia di creare una virtual environment python prima di installare i vari pacchetti per backend. 
