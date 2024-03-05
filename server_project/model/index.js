const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    fullName: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    refreshToken: {type: DataTypes.STRING, defaultValue: ""},
})

const Project = sequelize.define('project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    ownerId: {type: DataTypes.INTEGER},
})

const UserProjects = sequelize.define('user_projects', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.belongsToMany(Project, {through: UserProjects})
Project.belongsToMany(User, {through: UserProjects})


//EXPORTS//
module.exports = {
    Project,
    UserProjects,
}