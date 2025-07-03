// rolePermissions matrix can be moved to a config file if needed
const permissionsMatrix = {
  sales: {
    projects: ['create', 'read', 'update', 'delete'],
    tasks: ['create', 'read', 'update', 'delete'],
    team: ['create', 'read', 'update', 'delete'],
    reports: ['create', 'read', 'update', 'delete'],
    settings: ['read', 'update']
  },
  leads: {
    projects: ['create', 'read', 'update'],
    tasks: ['create', 'read', 'update'],
    team: ['read'],
    reports: ['read'],
    settings: []
  },
  recruiter: {
    projects: ['read'],
    tasks: ['create', 'read', 'update'],
    team: [],
    reports: ['read'],
    settings: []
  }
};

const authorizeRole = (resource, action) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !permissionsMatrix[role]) {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    const allowedActions = permissionsMatrix[role][resource] || [];

    if (!allowedActions.includes(action)) {
      return res.status(403).json({ error: 'Access denied for this action' });
    }

    next();
  };
};

module.exports = authorizeRole;
