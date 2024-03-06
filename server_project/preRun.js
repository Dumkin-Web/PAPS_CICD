require('dotenv').config()
const sequelize = require('./model/db')
const {DataTypes} = require("sequelize");
const {User, Project, UserProjects} = require("./model");

const start = async () => {
    try{
        await User.sync()
        await Project.sync()
        await UserProjects.sync()

        await sequelize.authenticate()
        await sequelize.sync()
    } catch(e) {
        console.log(e);
    }
}

start();