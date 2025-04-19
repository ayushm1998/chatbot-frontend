import sql from 'mssql';

const config = {
    server: import.meta.env.VITE_SERVER,
    database: import.meta.env.VITE_DATABSE,
    user: import.meta.env.VITE_USER,
    password:import.meta.env.VITE_PASSWORD,
    options : {
        trustedConnection : true
    }
};
//Database connection
export default function dbConnection() {                       
 //   return new Promise((resolve, reject) => {
        try {
            console.log("Hey")
            sql.connect(config, err => {
                if (err) {
                    console.log(err)
                    return('Failed to open a SQL Database connection.', err.stack);
                }
                console.log("SQL connected")
            })
        } catch (err) {
            return('Failed to connect to a SQL Database connection.', err.message);
        }

//    })

}

