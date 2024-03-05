const {badRequest} = require("../errors");

module.exports = function({body = [], params = [], query = []}){
    return function(req, res, next){
        const reqBody = req.body;
        const reqQuery = req.query;
        const reqParams = req.params;
        let notOk = false;

        body.forEach(({name, type}) => {
            if(!reqBody[name] || typeof reqBody[name] !== type) notOk = true;
        });
        query.forEach(({name, type}) => {
            if(!reqQuery[name] || type === 'number' && isNaN(Number(reqQuery[name]))) notOk = true;
        });
        params.forEach(({name, type}) => {
            if(!reqParams[name] || type === 'number' && isNaN(Number(reqParams[name]))) notOk = true;
        });

        if (notOk) throw badRequest({message: 'Bad request', body, params, query});
        next();
    }
}