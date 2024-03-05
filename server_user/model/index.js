const sequelize = require('./db')
const {DataTypes} = require('sequelize')

//USER
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    fullName: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    refreshToken: {type: DataTypes.STRING, defaultValue: ""},
})


//EXPORTS//
module.exports = {
    User,
}