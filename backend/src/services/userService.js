const User = require('../models/User');
const ApiError = require('../utils/apiError');

class UserService {
  async getAllUsers(query = {}) {
    const { search, role, page = 1, limit = 50 } = query;
    const filter = { isActive: true };

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(filter)
      .select('-refreshToken')
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }

  async getUserById(id) {
    const user = await User.findById(id).select('-refreshToken');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }
}

module.exports = new UserService();
