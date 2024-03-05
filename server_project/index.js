const express = require('express');
require('dotenv').config()
const sequelize = require('./model/db')
const cors = require('cors')
const errorMiddleware = require('./middleware/errorHandlingMiddleware')
const projectRouter = require("./controller/ProjectController");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors())
app.use(express.json())
app.use('', projectRouter);

app.use(errorMiddleware);

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Project service is runnig on port ${PORT}`))
    } catch(e) {
        console.log(e);
    }
}

start();

module.exports = {
    app
};