// src/middleware/example.js
const jwt = require("jsonwebtoken");
 
const generateToken = function (userId, email, applicationId) {
  const token = jwt.sign(
    { id: userId, email: email, applicationId: applicationId },
    "sjhfjhshkhskjhsfkhk",
    { expiresIn: "7d" }
  );

  const refreshToken = jwt.sign(
    { id: userId, email: email, applicationId: applicationId },
    "sjhfjhshkhskjhsfkhk",
    { expiresIn: "30d" }
  );

  return { token, refreshToken };
};

const refreshToken = (refToken) => {
  try {
    const decoded = jwt.verify(refToken, "sjhfjhshkhskjhsfkhk");
    console.log("decoded", decoded);
    return generateToken(decoded.id, decoded.email, decoded.applicationId);
  } catch (error) {
    throw error;
  }
};

const authenticate = async (req, res, next) => {
  let bearerHeader = req.header("authorization");
  console.log("bearerHeader", bearerHeader);

  if (bearerHeader !== undefined) {
    let token = bearerHeader.split(" ")[1];
    console.log("token", token);

    jwt.verify(token, "sjhfjhshkhskjhsfkhk", async (err, decoded) => {
      console.log("token val", err, decoded);

      if (err) {
        return res.status(401).json({
          code: 401,
          status: false,
          message: "Invalid Token",
          err: err,
        });
      }

      if (decoded) {
        req.body.user = decoded;
        req.body.userId = decoded.id;
        next();
      } else {
        return res.status(401).json({
          code: 401,
          status: false,
          message: "Invalid Token",
        });
      }
    });
  } else {
    return res.status(400).json({
      code: 400,
      status: false,
      message: "Token is required",
    });
  }
};

module.exports = {
  generateToken,
  refreshToken,
  authenticate,
};
