const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {badRequest, notFound} = require('../errors')
const {User} = require('../model')

const generateJWT = (email, fullName, id) => {
    return jwt.sign({email, fullName, id}, process.env.JWT_SECRET_KEY, {expiresIn: "24h"})
}


class UserService {

    async login(req, res, next){
        const {email, password} = req.body;
        try{
            const user = await User.findOne({where: {email}})
            if(!user){
                return next(badRequest('Not valid email or password'))
            }

            let comparedPassword = bcrypt.compareSync(password, user.password)
            if(!comparedPassword){
                return next(badRequest('Not valid email or password'))
            }

            return res.json({token: generateJWT(user.email, user.fullName, user.id)})
        }
        catch (e) {
            console.log(e);
            next(e);
        }
    }

    async registration(req, res, next){
        const {email, password, fullName} = req.body;
        try{

            if(await User.findOne({where: {email}})) return next(badRequest('User already exists'));

            const user = await User.create(
                {
                    email,
                    fullName,
                    password: await bcrypt.hash(password, 5)
                }
            );

            return res.status(201).json({token: generateJWT(email, fullName, user.id)})
        }
        catch (e) {
            console.log(e);
            next(e);
        }
    }

    async checkJWT(req, res, next) {
        try {
            res.json({token: generateJWT(req.user_info.email, req.user_info.fullName, req.user_info.id)});
        }
        catch (e) {
            next(e)
        }
    }

    async changeInfo(req, res, next){
        const {fullName, password} = req.body;
        const email = req.user_info.email;

        try{
            const user = await User.findOne({where: {email}});
            if(user === null) return next(badRequest('User not found'));
            user.password = await bcrypt.hash(password, 5);
            user.fullName = fullName;
            user.save();

            return res.status(200).json({token: generateJWT(user.email, user.fullName, user.id)})
        }
        catch (e) {
            next(e);
        }
    }

    async deleteAccount(req, res, next){
        const email = req.user_info.email;
        try {
            await User.destroy({where: {email}});
            return res.json({message: 'Account was deleted'})
        }
        catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next){
        const id = req.params.userId;

        try{
            const user = await User.findOne({where: {id}});

            if(!user){
                return next(notFound('User not found'))
            }

            res.json({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            });
        }
        catch (e) {
            next(e);
        }
    }
}

const validation = {
    login: {
        body: [
            {
                name: 'email',
                type: 'string',
            },
            {
                name: 'password',
                type: 'string',
            },
        ],
        params: [],
    },
    registration: {
        body: [
            {
                name: 'email',
                type: 'string',
            },
            {
                name: 'password',
                type: 'string',
            },
            {
                name: 'fullName',
                type: 'string',
            },
        ],
    },
    changeInfo: {
        body: [
            {
                name: 'password',
                type: 'string',
            },
            {
                name: 'fullName',
                type: 'string',
            },
        ],
        params: [],
    },
    getUser: {
        body: [],
        params: [
            {
                name: 'userId',
                type: 'number',
            },
        ],
    },
};

module.exports = {
    userService: new UserService(),
    validation,
};