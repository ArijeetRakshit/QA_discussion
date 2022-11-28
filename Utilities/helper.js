const pool = require('../db');

const getUserId = async(email) => {
    let sqlQuery = `SELECT Users.Id from Users where Users.Email = ?;`;
    let sqlValue = [email];
    const [ rows ] = await pool.query(sqlQuery,sqlValue);
    if(!rows.length || !rows[0].Id){
        let error = new ApiError(400,"Incorrect Email");
        throw error;
    }
    const userId = rows[0].Id;
    return userId;
}

module.exports = {
    getUserId
}