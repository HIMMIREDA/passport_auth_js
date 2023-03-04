class User {
  id;
  username;
  email;
  password;
  provider;
  photo;
  constructor(id, username, email, password, provider, photo) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.provider = provider;
    this.photo = photo;
  }
}

module.exports = User;
