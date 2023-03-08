# passport_auth_js

This repository contains examples of authentication and authorization using Express JS, React, Material UI, EJS, PostgreSQL, TypeOrm, and Passport JS.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Examples](#examples)
  - [Session](#session)
  - [JWT](#jwt)
  - [OAuth2.0 (OpenID Connect) without Passport](#oauth20_oidc_no_passport)
  - [OAuth2.0 (OpenID Connect) with Passport](#oauth20_oidc_passport)
- [License](#license)
- [Contributing](#contributing)

## Getting Started

To get started with the examples, follow the instructions below.

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HIMMIREDA/passport_auth_js.git
cd passport_auth_js
```


2. Install the dependencies:
```bash
cd <example-folder>
npm install
```

3. Create a `.env` file by copying the `.env.example` file and updating the values:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm run dev # run this command in the root of <example-folder> 
```
## Examples

### Session

This example uses sessions and the Passport JS local strategy.

To run this example, navigate to the `session` folder and follow the instructions in the [Installation](#installation) section.

### JWT

This example uses JSON Web Tokens (JWT) and the Passport JS JWT strategy.

To run this example, navigate to the `jwt` folder and follow the instructions in the [Installation](#installation) section.

### OAuth2.0 (OpenID Connect) without Passport

This example implements Google Sign-In using OAuth2.0 (OpenID Connect) without Passport JS. It uses sessions and the OAuth2.0 protocol.

This example has two subfolders: `server` and `client`.

To run this example, navigate to the `oauth2.0_oidc_no_passport/server` folder and follow the instructions in the [Installation](#installation) section. Then, navigate to the `oauth2.0_oidc_no_passport/client` folder and follow the instructions in the [Installation](#installation) section.

### OAuth2.0 (OpenID Connect) with Passport

This example implements Google Sign-In using OAuth2.0 (OpenID Connect) with Passport JS. It uses sessions and the OAuth2.0 protocol with the Google OAuth2.0 and local strategies.

This example has the same structure as `oauth2.0_oidc_no_passport`.

To run this example, navigate to the `oauth2.0_oidc_passport/server` folder and follow the instructions in the [Installation](#installation) section. Then, navigate to the `oauth2.0_oidc_passport/client` folder and follow the instructions in the [Installation](#installation) section.
