const express = require('express');
const { handleError, convertToApiError, notFound } = require('./Middleware/apiError');
const formRouter = require('./Form/route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/form',formRouter);
app.use('*',notFound);

app.use(convertToApiError);
app.use((err,req,res,next) => {
    handleError(err,res)
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=> console.log(`App is running at port ${PORT}`));

