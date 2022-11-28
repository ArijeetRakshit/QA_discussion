const Joi = require('joi');
const { ApiError } = require('./apiError');

const validateSignUp = (req,res,next) => {
    const Schema = Joi.object({
        name: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })

    let validateBody = Schema.validate(req.body,{ abortEarly: false });
    if(validateBody.error){
        let err = new ApiError(400, validateBody.error.message);
        return next(err);
    }
    next();
}

const validateSignIn = (req,res,next) => {
    const Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })

    let validateBody = Schema.validate(req.body,{ abortEarly: false });
    if(validateBody.error){
        let err = new ApiError(400, validateBody.error.message);
        return next(err);
    }
    next();
}

const validateCreatePost = (req,res,next) =>{
    const Schema = Joi.object({
        title: Joi.string().min(1).required(),
        description: Joi.string().min(1).required(),
        tag:Joi.string().min(0)
    })

    let validateBody = Schema.validate(req.body,{ abortEarly: false })
    
    if(validateBody.error){
        let err = new ApiError(400, validateBody.error.message);
        return next(err);
    }
    next();
}

const validateUpdatePost = (req,res,next) =>{
    const Schema = Joi.object({
        title: Joi.string().min(1),
        description: Joi.string().min(1),
        tag:Joi.string().min(0),
        postId:Joi.number().required()
    })

    let validateQuery = Schema.validate(req.query,{ abortEarly: false })

    if(validateQuery.error){
        let err = new ApiError(400, validateQuery.error.message);
        return next(err);
    }
    next();
}

const validateDeletePost = (req,res,next) =>{
    const Schema = Joi.object({
        postId:Joi.number().required()
    })

    let validateQuery = Schema.validate(req.query)

    if(validateQuery.error){
        let err = new ApiError(400, validateQuery.error.message);
        return next(err);
    }
    next();
}

const validateAddAnswer = (req,res,next) =>{
    const Schema = Joi.object({
        postId:Joi.number().strict().required(),
        answer: Joi.string().required()
    })

    let validateBody = Schema.validate(req.body,{ abortEarly: false })

    if(validateBody.error){
        let err = new ApiError(400, validateBody.error.message);
        return next(err);
    }
    next();
}

const validateGetAnswers = (req,res,next) => {
    const Schema = Joi.object({
        title: Joi.string().min(1).required()
    });
    let validateQuery = Schema.validate(req.query);
    if(validateQuery.error){
        let err = new ApiError(400, validateQuery.error.message);
        return next(err);
    }
    next();
}

const validateGetPosts = (req,res,next) => {
    const Schema = Joi.object({
        page:Joi.number().required(),
        title: Joi.string().min(1),
        tag: Joi.string().min(1)
    })
    let validateQuery = Schema.validate(req.query);
    if(validateQuery.error){
        let err = new ApiError(400, validateQuery.error.message);
        return next(err);
    }
    next();
}

module.exports = {
    validateSignUp,
    validateSignIn,
    validateCreatePost,
    validateUpdatePost,
    validateDeletePost,
    validateAddAnswer,
    validateGetAnswers,
    validateGetPosts
}