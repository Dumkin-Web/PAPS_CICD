const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {badRequest, notFound} = require('../errors')
const {Project} = require('../model')
const {UserProjects} = require("../model");


class ProjectService {
    async createProject(req, res, next){
        const {name} = req.body;
        try{
            const project = await Project.create({name, ownerId: req.user_info.id})
            const userProject = await UserProjects.create({userId: req.user_info.id, projectId: project.id})

            return res.status(201).json({projectId: project.id})
        }
        catch (e) {
            next(e);
        }
    }

    async getProject(req, res, next) {
        const id = req.params.id;

        try{
            const project = await Project.findOne({where: {id}});

            if(!project) next(notFound('Not found'));

            res.json({
                id: project.id,
                name: project.name,
                ownerId: project.ownerId,
            })
        }
        catch (e) {
            next(e);
        }

    }
}

const validation = {
    createProject: {
      body: [
          {
              name: 'name',
              type: 'string',
          },
      ],
      params: [],
  },
  getProject: {
      body: [],
      params: [
          {
              name: 'id',
              type: 'number',
          },
      ],
      query: [],
  },
};

module.exports = {
    projectService: new ProjectService(),
    validation,
};