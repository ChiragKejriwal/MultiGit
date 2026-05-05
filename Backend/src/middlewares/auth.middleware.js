const jwt = require("jsonwebtoken");
const supabase = require("../config/db");

const authUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "UnAuthorized" });
  }

  const { data, error } = await supabase
    .from("blacklist_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle(); // better than single()

  if (data) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
};

module.exports = { authUser };
