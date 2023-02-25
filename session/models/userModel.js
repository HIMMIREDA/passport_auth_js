class User {
  constructor(id, username, email, password, roles) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}

module.exports = User;
