import sql from 'mssql';

// sending request to the database
export default async function dbrequest(query)  {                 
  //  return new Promise((resolve, reject) => {
        try {
            const request = new sql.Request();
            request.query(query, async (err, recordset) => {
                if (err) {
                return(err.originalError.info.message || err)
                } else {
                    return(recordset.recordset)
                }
            })
        } catch (error) {
            return(error.message)
        }
   // })
}
