// config/rolePermissions.js
module.exports = {
  sales: {
    projects: ['read', 'create', 'update', 'delete'],
    tasks: ['read', 'create', 'update', 'delete'],
    team: ['read', 'create', 'update', 'delete'],
    reports: ['read'],
    settings: ['read', 'update']
  },
  leads: {
    projects: ['read'],
    tasks: ['read', 'create', 'update'],
    team: ['read'],
    reports: ['read'],
    settings: []
  },
  recruiter: {
    projects: [],
    tasks: ['read', 'create'],
    team: ['read'],
    reports: [],
    settings: []
  }
};

