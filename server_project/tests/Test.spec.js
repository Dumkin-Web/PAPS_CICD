require('dotenv').config()
const {app} = require('../index')
const {User} = require('../model/index')
const sequelize = require('../model/db')
const request = require('supertest')(app);
const {expect} = require('chai')
const {v4: uuidv4} = require('uuid')
const {decode, sign} = require('jsonwebtoken')

let projectId = '';
let jwtToken = '';
let userData = {
    email: uuidv4(),
    password: 'qwe123',
    fullName: 'Nikita',
};

describe('Project service tests', () => {
    before( async () => {
        await sequelize.authenticate()
        await sequelize.sync()
        return await User.create({
           email: userData.email,
           password: userData.password,
           fullName: userData.fullName
        }).then(() => {
            jwtToken = sign({
                email: userData.email,
                fullName: userData.fullName,
                id: userData.id
            }, process.env.JWT_SECRET_KEY, {expiresIn: "24h"});
        })
    })

    describe("Create Project Tests", async () => {

        it("Successful project creation", async  () => {
            return request.post("/project").set('Authorization', `Bearer ${jwtToken}`).send({
                name: 'Test project'
            }).expect(201).then((res, err) => {
                expect(res.body).to.have.property("projectId")
                projectId = res.body.projectId;
            });
        });

        it("Project creation with invalid jwt", async  () => {
            return request.post("/project").send({
                name: 'Test project'
            }).expect(401).then((res, err) => {
                expect(res.body).to.have.property("message")
                expect(res.body.message).to.be.eql('Not authorized')
            });
        });

        it("Empty body", async  () => {
            return request.post("/project").set('Authorization', `Bearer ${jwtToken}`).send({}).expect(400).then((res, err) => {
                expect(res.body).to.have.property("message")
                expect(res.body).to.have.property("body")
                expect(res.body).to.have.property("params")
                expect(res.body).to.have.property("query")
                expect(res.body.body).to.have.length(1);
            });
        });
    });
});
