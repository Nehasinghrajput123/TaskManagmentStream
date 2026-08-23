const projectService = require('../services/projectService');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const createProject = async (req, res, next) => {
    try {
      console.log("wbhjwbdhwgdhwdg",req.body,req.user)
        const project = await projectService.createProject(
            req.body,
            req.user
        );

        return sendSuccess(
            res,
            201,
            'Project created successfully',
            project
        );
    } catch (error) {
        next(error);
    }
};

const getAllProjects = async (req, res, next) => {
    try {
        const { projects, pagination } = await projectService.getAllProjects(
            req.user,
            req.query
        );

        return sendPaginated(
            res,
            200,
            'Projects retrieved successfully',
            projects,
            pagination
        );
    } catch (error) {
        next(error);
    }
};

const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await projectService.getProjectById(
            id,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Project retrieved successfully',
            project
        );
    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await projectService.updateProject(
            id,
            req.body,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Project updated successfully',
            project
        );
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        await projectService.deleteProject(id, req.user);

        return sendSuccess(
            res,
            200,
            'Project deleted successfully'
        );
    } catch (error) {
        next(error);
    }
};

const addMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const project = await projectService.addMember(
            id,
            userId,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Member added successfully',
            project
        );
    } catch (error) {
        next(error);
    }
};

const removeMember = async (req, res, next) => {
    try {
        const { id, userId } = req.params;

        const project = await projectService.removeMember(
            id,
            userId,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Member removed successfully',
            project
        );
    } catch (error) {
        next(error);
    }
};

const getMembers = async (req, res, next) => {
    try {
        const { id } = req.params;

        const members = await projectService.getMembers(
            id,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Project members retrieved successfully',
            members
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
    getMembers,
};