const express = require('express');
require('dotenv').config()
const sequelize = require('./model/db')
const cors = require('cors')
const errorMiddleware = require('./middleware/errorHandlingMiddleware')
const userRouter = require("./controller/UserController");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({

}))
app.use(express.json())
app.use('', userRouter);

app.use(errorMiddleware);

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`User service is runnig on port ${PORT}`));
    } catch(e) {
        console.log(e);
    }
}

start();

module.exports = {
    app
};