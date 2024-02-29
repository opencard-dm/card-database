import sqlite3 from 'sqlite3'

export const db = new sqlite3.Database("./database.db");

export function insertCardIds(cardIds: string[]) {
    db.serialize(() => {
        cardIds.forEach((cardId) => {
            db.run(`insert into cards(
                id
            ) VALUES(
                '${cardId}'
            )`, (err) => {
                if (err?.message.includes('UNIQUE constraint failed: cards.id')) {
                    console.log('すでに存在するID: ', cardId)
                } else {
                    console.error(err)
                }
            });
        })
    })
}

export async function getAll(sql): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
        if (err) reject();
        else resolve(rows);
    });
  });
}
