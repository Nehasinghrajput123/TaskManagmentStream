const Joi = require('joi');

const createBoardSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().allow('').default(''),
  position: Joi.number().integer().min(0).default(0),
});

const updateBoardSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().allow(''),
  position: Joi.number().integer().min(0),
});

module.exports = {
  createBoardSchema,
  updateBoardSchema,
};
