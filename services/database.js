import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'RPG.db', location: 'default'},
    () => console.log('Banco de dados aberto'),
    error => console.error('Banco de dados não aberto', error)
);

const iniciarDB = () => {
    db.transaction(bd => {
        bd.executeSql(
            `CREATE TABLE IF NOT EXISTS TB_PERSONAGEM(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME VARCHAR(100),
                CLASSE VARCHAR(100),
                NIVEL INTEGER,
                ATRIBUTOS VARCHAR(100),
                LASTATUALIZACAO INTEGER
                SINCRONIZADO BOOLEAN DEFAULT 0);`
        );
    });
};

const pegarPersonagem = (userID) => {
    return new Promise((resolve, reject) => {
        db.transaction(bd => {
            bd.executeSql(
                `SELECT * FROM TB_PERSONAGEM WHERE id = ?`,
                [userID],
                (_, result) => resolve(result.rows.raw()),
                (_, error) => reject(error)
            );
        });
    });
};

const pegarPersonagemById = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(bd => {
            bd.executeSql(
                `SELECT * FROM TB_PERSONAGEM WHERE id = ?`,
                [id],
                (_, result) => resolve(result.rows.item(0)),
                (_, error) => reject(error)
            );
        });
    });
};

const salvarPersonagem = (personagem, userID) => {
    return new Promise((resolve, reject) =>{
        db.transaction(bd =>{
            bd.executeSql(
                `INSERT INTO TB_PERSONAGEM(id, NOME, CLASSE, NIVEL, ATRIBUTOS, LASTATUALIZACAO) VALUES(?, ?, ?, ?, ?,?)`,
                [userID, personagem.NOME, personagem.CLASSE, personagem.NIVEL, JSON.stringify(personagem.ATRIBUTOS), Date.now()],
                (_, result) => resolve(result.insertId),
                (_, error) => reject(error)
            );
        });
    });
};

const editPersonagem = (id, personagem) =>{
    return new Promise((resolve, reject) => {
        db.transaction(bd => {
            bd.executeSql(
                `UPDATE TB_PERSONAGEM SET NOME = ?, CLASSE = ?, NIVEL = ?, ATRIBUTOS = ?, LASTATUALIZACAO = ?, SINCRONIZADO = 0 WHERE id = ?`,
                [personagem.NOME, personagem.CLASSE, personagem.NIVEL, JSON.stringify(personagem.ATRIBUTOS), Date.now(), 0, id],
                (_, result) => resolve(),
                (_, error) => rejecyt(error)
            );
        });
    });
};

const pegarPersonagemUnSync = () =>{
    return new Promise((resolve, reject) => {
        db.transaction(bd => {
            bd.executeSql(
                `SELECT * FROM TB_PERSONAGEM WHERE SINCRONIZADO = 0`,
                [],
                (bd, result) => {
                    console.log('Personagens não sincronizados', result.rows.raw());
                    const dados = result.rows.raw();
                    console.log('Dados encontrados', dados);
                    resolve(dados);
                },
                (bd,error) => { 
                    console.error('Erro ao pegar personagens não sincronizados', {
                        message: error.message,
                        code: error.code,
                        sqlErrorCode: error.sqlErrorCode
                    });
                    reject(error)
                }
            ),
            (error) => {
                console.error('Erro na transação', error);
                reject(error);
            }
        });
    });
};

export const acharEsincronizar = () => {
    return new Promise((resolve, reject) => {
        db.transaction(bd => {
            bd.executeSql(
                `SELECT * FROM TB_PERSONAGEM WHERE SINCRONIZADO = 0`,
                [],
                (_, result) => resolve(result.rows.raw()),
                (_, error) => reject(error)
            );
        });
    });
};

const markSync = (ids) => {
    return new Promise((resolve, reject) => {
        db.transaction(bd => {
            bd.executeSql(
                `UPDATE TB_PERSONAGEM SET SINCRONIZADO = 1 WHERE id IN (${ids.map(() => '?').join(',')})`,
                ids,
                (_, result) => resolve(),
                (_, error) => reject(error)
            );
        });
    });
};

export { iniciarDB, pegarPersonagem, pegarPersonagemById, salvarPersonagem, editPersonagem, pegarPersonagemUnSync, markSync };