const options_sqlite3 = {
    client: "sqlite3",
    connection: {
        filename: `${__dirname}/DB/mydb.sqlite`
    },
    useNullAsDefault: true
}

module.exports = {
    options_sqlite3
}