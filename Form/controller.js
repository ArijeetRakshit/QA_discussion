const bcrypt = require('bcrypt');
const pool = require('../db');
const { ApiError } = require('../Middleware/apiError');
const { jwtSign } = require('../Middleware/auth');
const { getUserId } = require('../Utilities/helper')


const signup = async(req,res,next) => {
    try{
        let sqlQuery = `SELECT Users.Id from Users order by Users.Id desc limit 1;`;
        let result = await pool.query(sqlQuery);
        let id = 1;
        if(result[0].length!==0){
            let latestUserId = result[0][0].Id;
            id = Number(latestUserId.split('U')[1])+1;
        }
        let idLength = Math.log(id) * Math.LOG10E + 1 | 0;
        let newUserId = 'U';
        if(idLength == 1) newUserId = newUserId + '00' + id;
        else if(idLength == 2) newUserId = newUserId+ '0'+id;
        else newUserId = newUserId + id;

        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password,3);
        sqlQuery = `Insert into Users (Id, Name, Email, Password) values ?;`;
        sqlValue = [[[newUserId,name,email,hashedPassword]]];
        result = await pool.query(sqlQuery,sqlValue);

        if(result[0].affectedRows === 0) {
            let error = new ApiError(500,"Internal Server Error");
            throw error;
        }
        const token = jwtSign({ email })
        res.send({ status: 'success', message: 'SignUp successful', token});

    }catch(err){
        if(err.code === 'ER_DUP_ENTRY'){
            err = new ApiError(403,"This Email Already Exists");
        }
        if(!(err instanceof ApiError)){
            err = new ApiError(500,"Internal Server Error");
        }
        next(err);
    }
}

const signin = async(req,res,next) => {
    try{
        const { email, password } = req.body;
        let sqlQuery = `SELECT Users.Password as userPassword from Users where Users.Email = ?;`
        let sqlValue = [email]

        const [ rows ] = await pool.query(sqlQuery,sqlValue)
        if(!rows.length || !rows[0].userPassword){
            let error = new ApiError(400,"Please check email and password");
            throw error;
        }

        let hashedPassword = rows[0].userPassword;
        const match = await bcrypt.compare(password,hashedPassword);
        if(!match) {
            let error = new ApiError(400,"Please check email and password");
            throw error
        }
        const token = jwtSign({ email })
        res.send({ status: 'success', message: 'SignIn successful', token});

    }catch(err){
        if(!(err instanceof ApiError)){
            err = new ApiError(500,"Internal Server Error");
        }
        next(err);
    }
}

const createPost = async(req,res,next) => {
    try{
        const userId = await getUserId(req.userEmail);
        let { title,description,tag } = req.body;

        let sqlQuery = `INSERT into Posts (userId,title,description,tag) values ?;`;
        let sqlValue = [[[userId,title,description,tag]]];
        
        let result = await pool.query(sqlQuery,sqlValue);

        let insertId = result[0].insertId;
        sqlQuery = `SELECT Users.Name as UserName, Posts.Id as PostId, Posts.Title, Posts.Description, Posts.Tag, Posts.CreatedTime from Posts inner join Users on Posts.UserId = Users.Id where Posts.Id = ?;`;
        sqlValue = [insertId];
        
        result = await pool.query(sqlQuery,sqlValue);

        res.send({ status: 'success', message: result[0] });

    }catch(err){
        if(!(err instanceof ApiError)){
            err = new ApiError(500,"Internal Server Error");
        }
        next(err);
    }
}

const updatePost = async (req,res,next) => {
    try{
        const userId = await getUserId(req.userEmail);
        const postId = req.query.postId;
        const { postId: unused, ...updateColumns } = req.query
        if(Object.keys(updateColumns).length === 0) {
            let error = new ApiError(400,`Enter the column to be updated`);
            throw error; 
        }
        sqlQuery = `UPDATE Posts set ? where Posts.Id = ? and Posts.UserId = ?;`;
        sqlValue = [ updateColumns,postId,userId ];

        let result = await pool.query(sqlQuery,sqlValue);
        if(result[0].affectedRows === 0){
            let error = new ApiError(403,`Forbidden to update the postId = ${postId}`);
            throw error;
        }

        sqlQuery = `SELECT Users.Name as UserName, Posts.Title, Posts.Description, Posts.Tag, Posts.CreatedTime from Posts inner join Users on Posts.UserId = Users.Id where Posts.Id = ?;`;
        sqlValue = [postId];
        
        result = await pool.query(sqlQuery,sqlValue);
        res.send({ status: 'success', message: result[0] });

    }catch(err){
        if(!(err instanceof ApiError)){
            err = new ApiError(500,"Internal Server Error");
        }
        next(err);
    }
}

const deletePost = async(req,res,next) => {
    try{
        const userId = await getUserId(req.userEmail);
        const postId = req.query.postId;
        sqlQuery = `DELETE from Posts where Posts.Id = ? and Posts.UserId = ?;`
        sqlValue = [postId,userId];

        let result = await pool.query(sqlQuery,sqlValue);
        if(result[0].affectedRows === 0){
            let error = new ApiError(403,`Forbidden to delete the postId = ${postId}`);
            throw error;
        }
        res.send({ status: 'success', message: 'Deleted the post successfully' });

    }catch(err){
        if(!(err instanceof ApiError)){
            err = new ApiError(500,"Internal Server Error");
        }
        next(err);
    }
}

const addAnswer = async(req,res,next) => {
    try{
        const userId = await getUserId(req.userEmail);
        let { postId, answer } = req.body;
        let sqlQuery = `INSERT into Answers (userId, postId, answer) values ?;`
        let sqlValue = [[[userId,postId,answer]]];

        let result = await pool.query(sqlQuery,sqlValue);
        if(result[0].affectedRows === 0){
            let error = new ApiError(404,"Question not available");
            throw error;
        }

        let insertId = result[0].insertId;
        sqlQuery = `SELECT Answers.PostId, Posts.Title, Answers.Id as AnswerId , Users.Name as AnswerBy, Answers.Answer, Answers.CreatedTime from Answers inner join Users on Answers.UserId = Users.Id inner join Posts on Answers.PostId = Posts.Id where Answers.Id = ?;`;
        sqlValue = [insertId];
        result = await pool.query(sqlQuery,sqlValue);

        res.send({ status: 'success', message:  result[0] });

    }catch(err){
        if(!(err instanceof ApiError)){
            err = new ApiError(500,"Internal Server Error");
        }
        next(err);
    }
    
}

const getAnswers = async(req,res,next) => {
    try{
        let title = req.query.title;
        let sqlQuery = `SELECT Posts.Id from Posts where Posts.Title = ?`
        let sqlValue = [title];
        let [ rows ] = await pool.query(sqlQuery,sqlValue);
        if(!rows.length || !rows[0].Id){
            let error = new ApiError(404,"Question not available");
            throw error;
        }

        let postId = rows[0].Id;
        let showColumn = ['Name', 'Answer', 'CreatedTime'];
        sqlQuery = `SELECT ?? from Answers inner join Users on Answers.UserId = Users.Id where Answers.PostId = ? order by Answers.CreatedTime desc;`
        sqlValue = [showColumn,postId];

        let results  = await pool.query(sqlQuery,sqlValue);
        if(results[0].length === 0){
            let error = new ApiError(404,`No answer available`);
            throw error;
        }
        res.send({ status:'success', message: results[0] });

    }catch(err){
        if(!(err instanceof ApiError)){
            err = new ApiError(500,"Internal Server Error");
        }
        next(err);
    }
}

const getPosts = async(req,res,next) => {
    try{
        let page = req.query.page;
        page = Number(page);
        let recordsPerPage = 2;
        let offsetValue = (page-1) * recordsPerPage;

        let title = req.query.title;
        let tag = req.query.tag;
        if(title === undefined) title = null;
        else title = `%${title}%`;
        if(tag === undefined) tag = null;
        else tag = `%${tag}%`;

        let sqlQuery = `SELECT Posts.Id, Users.Name, Posts.Title, Posts.Description, Posts.Tag, Posts.CreatedTime from Posts inner join Users on Posts.UserId = Users.Id 
        where (Posts.Title like ? or ? IS NULL) and (Posts.Tag like ? or ? IS NULL) order by Posts.CreatedTime desc limit ? offset ?;`
        let sqlValue = [title,title,tag,tag,recordsPerPage,offsetValue];

        let results = await pool.query(sqlQuery,sqlValue);
        if(results[0].length === 0){
            let error = new ApiError(404,`No questions found`);
            throw error;
        }
        res.send({ status:'success', message: results[0] });

    }catch(err){
        if(!(err instanceof ApiError)){
            err = new ApiError(500,"Internal Server Error");
        }
        next(err);
    }
}

module.exports = {
    signup,
    signin,
    createPost,
    updatePost,
    deletePost,
    addAnswer,
    getAnswers,
    getPosts
}