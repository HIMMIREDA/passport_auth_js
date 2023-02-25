class Role {
  static ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
  };
  constructor(id, role) {
    this.id = id;
    this.role = role;
  }
}

module.exports = Role;
