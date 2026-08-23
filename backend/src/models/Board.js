const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Board name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

boardSchema.index({ project: 1, position: 1 });

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
