const {app} = require('../index')
const request = require('supertest')(app);
const {expect} = require('chai')
const {v4: uuidv4} = require('uuid')
const {decode} = require('jsonwebtoken')

let email = '';
let jwtToken = '';
let userData = {};

describe('User service tests', () => {
    before( () => {
        email = uuidv4();
    })

    describe("SignUp Tests", async () => {

        it("Successful account creation", async  () => {
            return request.post("/signUp").send({
                email: email,
                password: "Qwe123",
                fullName: "Nikita"
            }).expect(201).then((res, err) => {
                expect(res.body).to.have.property("token")
            });
        });

        it("Account creation with the same email", async  () => {
            return request.post("/signUp").send({
                email: email,
                password: "Qwe123",
                fullName: "Nikita"
            }).expect(400).then((res, err) => {
                expect(res.body).to.have.property("message")
                expect(res.body.message).to.be.eql('User already exists')
            });
        });

        it("Empty body", async  () => {
            return request.post("/signUp").send({}).expect(400).then((res, err) => {
                expect(res.body).to.have.property("message")
                expect(res.body).to.have.property("body")
                expect(res.body).to.have.property("params")
                expect(res.body).to.have.property("query")
                expect(res.body.body).to.have.length(3);
            });
        });
    });

    describe("SignIn Tests", async () => {
        it("Successful authorization", async  () => {
            return request.post("/signIn").send({
                email: email,
                password: "Qwe123"
            }).expect(200).then((res, err) => {
                expect(res.body).to.have.property("token")
                jwtToken = res.body.token;
                const tempJWTDecode = decode(jwtToken);
                expect(tempJWTDecode).to.have.property("id")
                expect(tempJWTDecode).to.have.property("fullName")
                expect(tempJWTDecode).to.have.property("email")
                userData = tempJWTDecode;
            });
        });

        it("Authorization with the non-existent email and password", async  () => {
            return request.post("/signIn").send({
                email: email + "somerndemail",
                password: "Qwe123",
            }).expect(400).then((res, err) => {
                expect(res.body).to.have.property("message")
                expect(res.body.message).to.be.eql('Not valid email or password')
            });
        });

        it("Empty body", async  () => {
            return request.post("/signIn").send({}).expect(400).then((res, err) => {
                expect(res.body).to.have.property("message")
                expect(res.body).to.have.property("body")
                expect(res.body).to.have.property("params")
                expect(res.body).to.have.property("query")
                expect(res.body.body).to.have.length(2);
            });
        });
    });

    describe("Auth Tests", async () => {
        it("Successful account creation", async  () => {
            return request.get("/auth").set("Authorization", `Bearer ${jwtToken}`).expect(200).then((res, err) => {
                expect(res.body).to.have.property("token")
            });
        });

        it("Wrong token", async  () => {
            return request.get("/auth").set("Authorization", `Bearer ${jwtToken}asd`).expect(401).then((res, err) => {
                expect(res.body).to.have.property("message")
                expect(res.body.message).to.be.eql('Not authorized')
            });
        });
    });

    describe("Get User Tests", async () => {
        it("Successful receiving data", async  () => {
            return request.get(`/getUser/${userData.id}`).set("Authorization", `Bearer ${jwtToken}`).expect(200).then((res, err) => {
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("fullName");
                expect(res.body).to.have.property("email");

                expect(res.body.id).to.be.eql(userData.id);
                expect(res.body.fullName).to.be.eql(userData.fullName);
                expect(res.body.email).to.be.eql(userData.email);
            });
        });


    });

    const newPassword = "Qwe1234";
    const newFullName = "Nikitos";
    describe("Update User Info Tests", async () => {
        it("Successful info update", async  () => {
            return request.put("/updateUserInfo").set("Authorization", `Bearer ${jwtToken}`).send({
                password: newPassword,
                fullName: newFullName
            }).expect(200).then((res, err) => {
                expect(res.body).to.have.property("token")
                const tempJWTDecode = decode(res.body.token);
                expect(tempJWTDecode.id).to.be.eql(userData.id);
                expect(tempJWTDecode.fullName).to.be.eql(newFullName);
                expect(tempJWTDecode.email).to.be.eql(userData.email);

                return request.post("/signIn").send({
                    email: email,
                    password: newPassword
                }).expect(200).then((res, err) => {
                    expect(res.body).to.have.property("token")
                });
            });
        });
    });

    describe("Delete Account Test", async () => {
        it("Successful info update", async  () => {
            return request.delete("/deleteAccount").set("Authorization", `Bearer ${jwtToken}`).expect(200).then((res, err) => {
                expect(res.body).to.have.property("message")
                return request.post("/signIn").send({
                    email: email,
                    password: newPassword
                }).expect(400).then((res, err) => {
                    expect(res.body).to.have.property("message")
                });
            });
        });
    });
});
