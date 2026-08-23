const Joi = require('joi');

const createTaskSchema = Joi.object({
  project: Joi.string().hex().length(24).required(),
  board: Joi.string().hex().length(24).required(),
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().allow('').default(''),
  status: Joi.string().valid('todo', 'in_progress', 'done').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  dueDate: Joi.date().iso().allow(null, ''),
  assignedTo: Joi.string().hex().length(24).allow(null, ''),
  position: Joi.number().integer().min(0).default(0),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().allow(''),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  dueDate: Joi.date().iso().allow(null, ''),
  assignedTo: Joi.string().hex().length(24).allow(null, ''),
  board: Joi.string().hex().length(24),
  position: Joi.number().integer().min(0),
});

const patchStatusSchema = Joi.object({
  status: Joi.string().valid('todo', 'in_progress', 'done').required(),
});

const patchAssignSchema = Joi.object({
  assignedTo: Joi.string().hex().length(24).allow(null, ''),
});

const patchPositionSchema = Joi.object({
  board: Joi.string().hex().length(24),
  position: Joi.number().integer().min(0).required(),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  patchStatusSchema,
  patchAssignSchema,
  patchPositionSchema,
};
