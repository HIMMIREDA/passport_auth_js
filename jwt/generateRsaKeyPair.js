const crypto = require("crypto")
const fs = require("fs/promises");

const genKeyPair = () => {
  crypto.generateKeyPair(
    "rsa",
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    },
    (err, publicKey, privateKey) => {
      if (err) throw new Error(err.message);
      Promise.all([
        fs.writeFile("./id_rsa_pub.pem", publicKey, "utf-8"),
        fs.writeFile("./id_rsa_priv.pem", privateKey, "utf-8"),
      ])
        .then((values) => {
          console.log("keypair generated");
        })
        .catch((err) => console.log(err));
    }
  );
};

genKeyPair();

