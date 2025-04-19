import sql from 'mssql';
//require('dotenv').config()
const config = {
    server: 'ipgedata.database.windows.net',
    database: 'ipge',
    user: "ayushipge",
    password:"Qwerty123",
    options : {
        trustedConnection : true
    }
};
//Database connection
function dbConnection() {                         // Connecting to Ms Sql database
    return new Promise((resolve, reject) => {
        try {
            sql.connect(config, err => {
                if (err) {
                    console.log(err)
                    reject('Failed to open a SQL Database connection.', err.stack);
                }
                console.log("SQL connected")
            })
        } catch (err) {
            reject('Failed to connect to a SQL Database connection.', err.message);
        }

    })

}
