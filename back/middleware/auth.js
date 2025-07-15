const jwt = require("jsonwebtoken");


function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; 

  if (!token) return res.status(401).json({ msg: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
