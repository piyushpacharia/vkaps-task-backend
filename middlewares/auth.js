import JWTService from "../services/JWTService.js";

export const authorization = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(404).json({
      success: false,
      message: "Token is not found",
    });
  }

  try {
    let token = authHeader.split(" ")[1];
    const { _id, role ,adminId} = await JWTService.verify(token);
    console.log(_id)
    const user = {
      _id,
      role
    };
 
    if (adminId) {
      user.adminId = adminId; 
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      success: false,
      message: `Error occur ${err.message}`,
    });
  }
};
export const checkAdminRole = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try { 
    const decoded = JWTService.verify(token, process.env.JWT_SECRET);
     
    if (decoded.role === 'admin') { 
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


