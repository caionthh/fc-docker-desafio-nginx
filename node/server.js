const express = require('express')
const mysql = require('mysql');

const app = express()
const port = 3000

const config={
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const connection = mysql.createConnection(config);
connection.query('CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key(id))',
    (err, result, fields) => {
        if (err) throw err;
        console.log("Tabela people criada");
    }
);

const fetchSql = `SELECT name FROM people`;
//connection.end()

const insertQuery = (insertName) => {
    const insertSql = `INSERT INTO people(name) VALUES('${insertName}')`;
    connection.query(insertSql);
}


app.get(['/', '/:n'], (req, res) => {
    let insertName = req.params.n;
    if (insertName === undefined)
        insertName = 'Caio'

    insertQuery(insertName);

    const names = [];

    connection.query(fetchSql, (err, result, fields) => {
        if (err) throw err;

        result.map(row => {
            names.push(row.name);
        })

        const html = `
            <h1>Full Cycle Rocks!</h1>
            <ul>${names.map(name => `<li>${name}</li>`).join('')}
            </ul>
        `;

        res.send(html);
    });

})

app.listen(port, () => {
    console.log(`Escutando na porta ${port}`);
})