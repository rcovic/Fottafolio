from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # Abilita le richieste CORS per permettere al frontend di comunicare con il backend

# Funzione per ottenere la connessione al database
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON;')
    return conn

# Funzione per eseguire query sul database
def query_db(conn, query, args=(), one=False):
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    return (rv[0] if rv else None) if one else rv

# Funzione per validare i numeri
def is_valid_number(value):
    try:
        num = int(value)
        return num >= 0
    except (ValueError, TypeError):
        return False

# Rotte API

## Gestione dei giocatori

@app.route('/api/giocatori', methods=['GET', 'POST'])
def api_giocatori():
    conn = get_db_connection()
    if request.method == 'GET':
        giocatori = query_db(conn, 'SELECT * FROM giocatori')
        conn.close()
        return jsonify([dict(ix) for ix in giocatori])
    elif request.method == 'POST':
        nome = request.json.get('nome')
        if not nome:
            conn.close()
            return jsonify({'error': 'Nome del giocatore richiesto'}), 400
        query_db(conn, 'INSERT INTO giocatori (nome) VALUES (?)', [nome])
        conn.commit()
        conn.close()
        return jsonify({'message': 'Giocatore aggiunto'}), 201

## Gestione delle partite

@app.route('/api/partite', methods=['GET', 'POST'])
def api_partite():
    conn = get_db_connection()
    if request.method == 'GET':
        partite = query_db(conn, 'SELECT * FROM partite')
        conn.close()
        return jsonify([dict(ix) for ix in partite])
    elif request.method == 'POST':
        data = request.json.get('data')
        gol_bianchi = request.json.get('gol_bianchi')
        gol_colorati = request.json.get('gol_colorati')
        squadra_bianchi = request.json.get('squadra_bianchi', [])
        squadra_colorati = request.json.get('squadra_colorati', [])

        # Validazioni
        if not data or not is_valid_number(gol_bianchi) or not is_valid_number(gol_colorati):
            conn.close()
            return jsonify({'error': 'Dati non validi'}), 400
        if len(squadra_bianchi) > 5 or len(squadra_colorati) > 5:
            conn.close()
            return jsonify({'error': 'Ogni squadra può avere al massimo 5 giocatori'}), 400

        try:
            # Inserisci la partita
            cur = conn.cursor()
            cur.execute('INSERT INTO partite (data, gol_bianchi, gol_colorati) VALUES (?, ?, ?)',
                        [data, gol_bianchi, gol_colorati])
            partita_id = cur.lastrowid

            # Inserisci partecipazioni
            for giocatore_id in squadra_bianchi:
                cur.execute('INSERT INTO partecipazioni (partita_id, giocatore_id, squadra, gol, assist) VALUES (?, ?, ?, ?, ?)',
                            [partita_id, giocatore_id, 'Bianchi', 0, 0])
            for giocatore_id in squadra_colorati:
                cur.execute('INSERT INTO partecipazioni (partita_id, giocatore_id, squadra, gol, assist) VALUES (?, ?, ?, ?, ?)',
                            [partita_id, giocatore_id, 'Colorati', 0, 0])

            conn.commit()
            conn.close()
            return jsonify({'partita_id': partita_id}), 201
        except sqlite3.IntegrityError as e:
            conn.rollback()
            conn.close()
            return jsonify({'error': str(e)}), 400

## Gestione dei gol e assist per partita

@app.route('/api/partite/<int:partita_id>/gol_assist', methods=['POST'])
def api_gol_assist(partita_id):
    conn = get_db_connection()
    partecipazioni = query_db(conn, 'SELECT * FROM partecipazioni WHERE partita_id = ?', [partita_id])

    if not partecipazioni:
        conn.close()
        return jsonify({'error': 'Partita non trovata'}), 404

    try:
        total_gol_bianchi = 0
        total_gol_colorati = 0
        total_assist_bianchi = 0
        total_assist_colorati = 0

        for partecipazione in partecipazioni:
            giocatore_id = partecipazione['giocatore_id']
            squadra = partecipazione['squadra']
            gol = request.json.get(f'gol_{giocatore_id}', 0)
            assist = request.json.get(f'assist_{giocatore_id}', 0)

            if not (is_valid_number(gol) and is_valid_number(assist)):
                conn.close()
                return jsonify({'error': 'Gol e assist devono essere numeri interi non negativi'}), 400

            query_db(conn, 'UPDATE partecipazioni SET gol = ?, assist = ? WHERE partita_id = ? AND giocatore_id = ?',
                     [gol, assist, partita_id, giocatore_id])

            if squadra == 'Bianchi':
                total_gol_bianchi += int(gol)
                total_assist_bianchi += int(assist)
            else:
                total_gol_colorati += int(gol)
                total_assist_colorati += int(assist)

        partita = query_db(conn, 'SELECT * FROM partite WHERE id = ?', [partita_id], one=True)
        gol_bianchi = int(partita['gol_bianchi'])
        gol_colorati = int(partita['gol_colorati'])

        # Validazioni delle somme
        if total_gol_bianchi > gol_bianchi or total_gol_colorati > gol_colorati:
            conn.close()
            return jsonify({'error': 'La somma dei gol dei giocatori non può superare i gol totali della squadra'}), 400
        if total_assist_bianchi > gol_bianchi or total_assist_colorati > gol_colorati:
            conn.close()
            return jsonify({'error': 'La somma degli assist dei giocatori non può superare i gol totali della squadra'}), 400

        conn.commit()
        conn.close()
        return jsonify({'message': 'Gol e assist aggiornati'}), 200
    except sqlite3.IntegrityError as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400

## Recupero delle partecipazioni per una partita
@app.route('/api/partite/<int:partita_id>/partecipazioni', methods=['GET'])
def api_partecipazioni(partita_id):
    conn = get_db_connection()
    partecipazioni = query_db(conn, '''
        SELECT p.*, g.nome FROM partecipazioni p
        JOIN giocatori g ON p.giocatore_id = g.id
        WHERE p.partita_id = ?
    ''', [partita_id])
    conn.close()
    return jsonify([dict(ix) for ix in partecipazioni])


# Eliminazione di un giocatore
@app.route('/api/giocatori/<int:giocatore_id>', methods=['DELETE'])
def api_elimina_giocatore(giocatore_id):
    conn = get_db_connection()
    # Controlla se il giocatore esiste prima di eliminarlo
    giocatore = query_db(conn, 'SELECT * FROM giocatori WHERE id = ?', [giocatore_id], one=True)
    if not giocatore:
        conn.close()
        return jsonify({'error': 'Giocatore non trovato'}), 404
    
    # Elimina il giocatore
    query_db(conn, 'DELETE FROM giocatori WHERE id = ?', [giocatore_id])
    conn.commit()
    conn.close()
    return jsonify({'message': 'Giocatore eliminato'}), 200


## Eliminazione delle partite

@app.route('/api/partite/<int:partita_id>', methods=['DELETE'])
def api_elimina_partita(partita_id):
    conn = get_db_connection()
    query_db(conn, 'DELETE FROM partite WHERE id = ?', [partita_id])
    conn.commit()
    conn.close()
    return jsonify({'message': 'Partita eliminata'}), 200

## Eliminazione delle partite e Recupero dei dettagli

@app.route('/api/partite/<int:partita_id>', methods=['GET', 'DELETE'])
def handle_partita(partita_id):
    conn = get_db_connection()
    if request.method == 'GET':
        partita = query_db(conn, 'SELECT * FROM partite WHERE id = ?', [partita_id], one=True)
        if not partita:
            conn.close()
            return jsonify({'error': 'Partita non trovata'}), 404

        partecipazioni = query_db(conn, '''
            SELECT p.*, g.nome 
            FROM partecipazioni p
            JOIN giocatori g ON p.giocatore_id = g.id
            WHERE p.partita_id = ?
        ''', [partita_id])

        # Convertire i risultati in dizionario
        partecipazioni_list = [dict(ix) for ix in partecipazioni]

        partita_dict = dict(partita)
        partita_dict['partecipazioni'] = partecipazioni_list

        conn.close()
        return jsonify(partita_dict), 200

    elif request.method == 'DELETE':
        query_db(conn, 'DELETE FROM partite WHERE id = ?', [partita_id])
        conn.commit()
        conn.close()
        return jsonify({'message': 'Partita eliminata'}), 200


## Statistiche

@app.route('/api/statistiche', methods=['GET'])
def api_statistiche():
    conn = get_db_connection()

    # Statistiche di squadra
    squadre_stats = []
    for squadra in ['Bianchi', 'Colorati']:
        tot_partite = query_db(conn, 'SELECT COUNT(*) FROM partite', one=True)[0] or 0
        vittorie = query_db(conn, '''
            SELECT COUNT(*) FROM partite
            WHERE (gol_bianchi > gol_colorati AND ? = "Bianchi") OR (gol_colorati > gol_bianchi AND ? = "Colorati")
        ''', [squadra, squadra], one=True)[0] or 0
        sconfitte = query_db(conn, '''
            SELECT COUNT(*) FROM partite
            WHERE (gol_bianchi < gol_colorati AND ? = "Bianchi") OR (gol_colorati < gol_bianchi AND ? = "Colorati")
        ''', [squadra, squadra], one=True)[0] or 0
        pareggi = tot_partite - vittorie - sconfitte
        squadre_stats.append({
            'squadra': squadra,
            'vittorie': vittorie,
            'sconfitte': sconfitte,
            'pareggi': pareggi
        })

    # Statistiche individuali
    giocatori = query_db(conn, 'SELECT * FROM giocatori')
    stats = []
    for giocatore in giocatori:
        giocatore_id = giocatore['id']
        nome = giocatore['nome']

        # Gol e assist totali
        gol = query_db(conn, 'SELECT SUM(gol) FROM partecipazioni WHERE giocatore_id = ?', [giocatore_id], one=True)[0] or 0
        assist = query_db(conn, 'SELECT SUM(assist) FROM partecipazioni WHERE giocatore_id = ?', [giocatore_id], one=True)[0] or 0

        # Vittorie, sconfitte e pareggi
        vittorie = query_db(conn, '''
            SELECT COUNT(*) FROM partecipazioni p
            JOIN partite pa ON p.partita_id = pa.id
            WHERE p.giocatore_id = ? AND (
                (p.squadra = 'Bianchi' AND pa.gol_bianchi > pa.gol_colorati) OR
                (p.squadra = 'Colorati' AND pa.gol_colorati > pa.gol_bianchi)
            )
        ''', [giocatore_id], one=True)[0] or 0

        sconfitte = query_db(conn, '''
            SELECT COUNT(*) FROM partecipazioni p
            JOIN partite pa ON p.partita_id = pa.id
            WHERE p.giocatore_id = ? AND (
                (p.squadra = 'Bianchi' AND pa.gol_bianchi < pa.gol_colorati) OR
                (p.squadra = 'Colorati' AND pa.gol_colorati < pa.gol_bianchi)
            )
        ''', [giocatore_id], one=True)[0] or 0

        pareggi = query_db(conn, '''
            SELECT COUNT(*) FROM partecipazioni p
            JOIN partite pa ON p.partita_id = pa.id
            WHERE p.giocatore_id = ? AND pa.gol_bianchi = pa.gol_colorati
        ''', [giocatore_id], one=True)[0] or 0

        stats.append({
            'nome': nome,
            'gol': gol,
            'assist': assist,
            'vittorie': vittorie,
            'sconfitte': sconfitte,
            'pareggi': pareggi
        })
    conn.close()

    return jsonify({
        'squadre_stats': squadre_stats,
        'giocatori_stats': stats
    })

if __name__ == '__main__':
    # Creazione delle tabelle se non esistono
    conn = get_db_connection()
    query_db(conn, '''
        CREATE TABLE IF NOT EXISTS giocatori (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        );
    ''')
    query_db(conn, '''
        CREATE TABLE IF NOT EXISTS partite (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            gol_bianchi INTEGER,
            gol_colorati INTEGER
        );
    ''')
    query_db(conn, '''
        CREATE TABLE IF NOT EXISTS partecipazioni (
            partita_id INTEGER,
            giocatore_id INTEGER,
            squadra TEXT,
            gol INTEGER DEFAULT 0,
            assist INTEGER DEFAULT 0,
            FOREIGN KEY(partita_id) REFERENCES partite(id) ON DELETE CASCADE,
            FOREIGN KEY(giocatore_id) REFERENCES giocatori(id) ON DELETE CASCADE
        );
    ''')
    conn.commit()
    conn.close()
    app.run(debug=True)
