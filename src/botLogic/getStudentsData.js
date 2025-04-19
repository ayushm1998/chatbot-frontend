
import dbQuery from "../helper/dbQuery.json";
import responseMessage from '../helper/responseMessage.json'
import dbrequest from '../utils/dbRequest.js'
import format from 'pg-format'

export default  async function getStudentData (studentId)  {  
  // return new Promise(async (resolve, reject) => {
        try {
            console.log(studentId)
            let formattedquery = format(dbQuery.Student.getStudentData, studentId)
            let studentInfo =  dbrequest(formattedquery).catch(err => reject(err)) 
            if (studentInfo.length === 0) {
                return(responseMessage.Student.student_not_found)
            } else {
                return(studentInfo[0])
            }
        } catch (err) {
            return(err.message)
        }
  //  })
}
 