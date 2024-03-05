require('dotenv').config()
const sequelize = require('./model/db')

Promise.all([
    sequelize.authenticate(),
    sequelize.sync(),
])