const Joi = require('joi');

const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().allow('').default(''),
  status: Joi.string().valid('active', 'completed', 'archived').default('active'),
  members: Joi.array().items(Joi.string().hex().length(24)).default([]),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().allow(''),
  status: Joi.string().valid('active', 'completed', 'archived'),
  members: Joi.array().items(Joi.string().hex().length(24)),
});

const addMemberSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
};
