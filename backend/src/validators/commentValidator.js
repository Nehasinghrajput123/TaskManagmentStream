const Joi = require('joi');

const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required(),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required(),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
};
