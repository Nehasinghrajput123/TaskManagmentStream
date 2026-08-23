const Project = require("../models/Project");
const Board = require("../models/Board");
const Task = require("../models/Task");
const Comment = require("../models/Comment");
const Activity = require("../models/Activity");
const User = require("../models/User");
const ApiError = require("../utils/apiError");

const checkProjectAccess = (project, userId, userRole) => {
  if (userRole === "admin") {
    return true;
  }

  const currentUserId = userId.toString();

  const isOwner =
    project.owner?._id?.toString() === currentUserId ||
    project.owner?.toString() === currentUserId;

  const isMember = project.members?.some((member) => {
    const memberId = member?._id
      ? member._id.toString()
      : member.toString();

    return memberId === currentUserId;
  });

  if (!isOwner && !isMember) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project."
    );
  }

  return true;
};

const checkProjectManagementRights = (project, userId, userRole) => {
  if (userRole === "admin") {
    return true;
  }

  const ownerId = project.owner?._id
    ? project.owner._id.toString()
    : project.owner.toString();

  const isOwner = ownerId === userId.toString();

  if (!isOwner && userRole !== "manager") {
    throw new ApiError(
      403,
      "Permission denied. Only project owner, manager, or admin can modify project settings."
    );
  }

  return true;
};

const createProject = async (data, currentUser) => {
  const members = new Set(data.members || []);

  // members.add(currentUser._id.toString());

  const project = await Project.create({
    name: data.name,
    description: data.description || "",
    status: data.status || "active",
    owner: currentUser._id,
    members: Array.from(members),
  });

  await Board.create({
    project: project._id,
    name: "Main Board",
    description: "Default project board",
    position: 0,
  });

  return Project.findById(project._id)
    .populate("owner", "name email avatar role")
    .populate("members", "name email avatar role");
};

const getAllProjects = async (user, query = {}) => {
  const {
    status,
    search,
    page = 1,
    limit = 10,
  } = query;

  const filter = {};

  if (user.role !== "admin") {
    filter.$or = [
      { owner: user._id },
      { members: user._id },
    ];
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  const currentPage = Number(page);
  const currentLimit = Number(limit);
  const skip = (currentPage - 1) * currentLimit;

  const projects = await Project.find(filter)
    .populate("owner", "name email avatar role")
    .populate("members", "name email avatar role")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(currentLimit);

  const total = await Project.countDocuments(filter);

  return {
    projects,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
    },
  };
};

const getProjectById = async (projectId, user) => {
  console.log("wbdueduedue",projectId,user)
  const project = await Project.findById(projectId)
    .populate("owner", "name email avatar role")
    .populate("members", "name email avatar role");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  checkProjectAccess(project, user._id, user.role);

  return project;
};

const updateProject = async (projectId, updateData, user) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  checkProjectManagementRights(project, user._id, user.role);

  if (updateData.name !== undefined) {
    project.name = updateData.name;
  }

  if (updateData.description !== undefined) {
    project.description = updateData.description;
  }

  if (updateData.status !== undefined) {
    project.status = updateData.status;
  }

  if (updateData.members) {
    const members = new Set(updateData.members);

    members.add(project.owner.toString());

    project.members = Array.from(members);
  }

  await project.save();

  return Project.findById(projectId)
    .populate("owner", "name email avatar role")
    .populate("members", "name email avatar role");
};

const deleteProject = async (projectId, user) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  checkProjectManagementRights(project, user._id, user.role);

  const tasks = await Task.find({
    project: projectId,
  }).select("_id");

  const taskIds = tasks.map((task) => task._id);

  await Comment.deleteMany({
    task: { $in: taskIds },
  });

  await Activity.deleteMany({
    task: { $in: taskIds },
  });

  await Task.deleteMany({
    project: projectId,
  });

  await Board.deleteMany({
    project: projectId,
  });

  await Project.findByIdAndDelete(projectId);

  return true;
};

const addMember = async (projectId, memberId, user) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  checkProjectManagementRights(project, user._id, user.role);

  const targetUser = await User.findById(memberId);

  if (!targetUser) {
    throw new ApiError(404, "User to add not found");
  }

  const alreadyMember = project.members.some(
    (member) => member.toString() === memberId.toString()
  );

  if (!alreadyMember) {
    project.members.push(memberId);
    await project.save();
  }

  return Project.findById(projectId)
    .populate("owner", "name email avatar role")
    .populate("members", "name email avatar role");
};

const removeMember = async (projectId, memberId, user) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  checkProjectManagementRights(project, user._id, user.role);

  if (project.owner.toString() === memberId.toString()) {
    throw new ApiError(
      400,
      "Cannot remove the project owner from members"
    );
  }

  project.members = project.members.filter(
    (member) => member.toString() !== memberId.toString()
  );

  await project.save();

  return Project.findById(projectId)
    .populate("owner", "name email avatar role")
    .populate("members", "name email avatar role");
};

const getMembers = async (projectId, user) => {
  const project = await Project.findById(projectId).populate(
    "members",
    "name email avatar role"
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  checkProjectAccess(project, user._id, user.role);

  return project.members;
};

module.exports = {
  checkProjectAccess,
  checkProjectManagementRights,
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getMembers,
};