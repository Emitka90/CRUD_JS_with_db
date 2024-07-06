const { rejects } = require('assert');
const { resolve } = require('path');
const { getUserById, updateUser } = require('./data');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('yourdatabase.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    birthday TEXT NOT NULL,
    age INTEGER
)`);

const ageCalc = function(birthday) {
    birthday = birthday.split('.');
    let todayDate = new Date();
    let todayYear = todayDate.getFullYear();
    let todayMonth = todayDate.getMonth();
    let todayDay = todayDate.getDate();
    let age = todayYear - +birthday[2];
    
    if ( todayMonth < (+birthday[1] - 1)) {
        age--;
    }
    if (((+birthday[1] - 1) == todayMonth) && (todayDay < +birthday[0])) {
        age--;
    }
    return age;
};

module.exports = {
    async addUser(user) {
        const lastID = await new Promise((resolve, reject) => {
            db.run('INSERT INTO users (name, birthday, age) VALUES (?, ?, ?)', [user.name, user.birthday, ageCalc(user.birthday)], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
        return {id: lastID, ...user};
    },

    async getUsers() {
        try {
            const users = await new Promise((resolve, reject) => {
               db.all('SELECT * FROM users', [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }

               });
            });
            return users;
        } catch (err) {
            return null;
        }
    },

    async getUserById(id) {
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        return user;
    },

    async updateUser(id, updatedData) {
        const changes = await new Promise((resolve, reject) => {
            db.run('SELECT * FROM users WHERE id = ?', [updatedData.name, updatedData.birthday, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
        if (changes === 0) {
            return null;
        }
        return this.getUserById(id);
    },

    async deleteUser(id) {
        const changes = await new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
        return changes > 0;
    }
}