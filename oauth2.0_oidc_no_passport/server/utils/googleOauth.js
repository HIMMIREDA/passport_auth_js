const axios = require("axios").default;
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const getGoogleOauthToken = async (authCode) => {
  const axiosInstance = axios.create({
    validateStatus: (status) => {
      return 200 <= status && status < 300;
    },
  });
  const rootUrl = "https://oauth2.googleapis.com/token";
  const options = {
    code: authCode,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };
  try {
    const { data } = await axiosInstance.post(rootUrl, options, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const verifyIdToken = async (idToken) => {
  // google public key in format of jwk (json web key)
  const JWKurl = "https://www.googleapis.com/oauth2/v3/certs";
  // key id
  const { kid } = jwt.decode(idToken, { complete: true }).header;
  const client = jwksClient({
    jwksUri: JWKurl,
  });

  try {
    const key = await client.getSigningKey(kid);
    const pubKey = key.getPublicKey();
    
    if (!pubKey) {
      throw new Error("Sorry something wrong happened !");
    }

    const decoded = jwt.verify(idToken, pubKey, {
      algorithms: [key.alg],
      issuer: "https://accounts.google.com",
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    return decoded;
  } catch (error) {
    throw new Error(error);
  }
};

// const refreshGoogleOauthToken = async (refreshToken) => {
//   const axiosInstance = axios.create({
//     validateStatus: (status) => {
//       return 200 <= status && status < 300;
//     },
//   });

//   const rootUrl = "https://oauth2.googleapis.com/token";

//   const options = {
//     client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
//     client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
//     refresh_token: refreshToken,
//     grant_type: "refresh_token",
//   };

//   try {
//     const { data } = await axiosInstance.post(rootUrl, options, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     return data;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

module.exports = {
  getGoogleOauthToken,
  verifyIdToken,
};
