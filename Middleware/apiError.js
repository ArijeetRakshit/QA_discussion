class ApiError extends Error {
    constructor(statusCode,message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (err,res) => {
    const { statusCode, message } = err;
    res.status(statusCode).json({
        status:'error',
        statusCode,
        message
    })
}

const convertToApiError = (err,req,res,next) => {
    let error = err;
    if(!(err instanceof ApiError)){
        const statusCode = 500;
        const message = 'Interal Server Error';
        error = new ApiError(statusCode,message); 
    }
    next(error);
}

const notFound = (req,res,next) => {
    let error = new ApiError(404,'Not Found');
    next(error)
}

module.exports = {
    ApiError,
    handleError,
    convertToApiError,
    notFound
}