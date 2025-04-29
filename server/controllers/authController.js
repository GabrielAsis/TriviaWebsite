const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');

const test = (req, res) => { 
  res.json('test is working');
}

//  Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if name was entered
    if(!name) {
      return res.json({
        error: 'Name is required'
      })
    };
    // Check if password is good
    if(!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be at least 6 characters long'
      })
    };
    // Check email
    const exist = await User.findOne({email});
    if(exist) {
      return res.json({
        error: 'Email is already taken'
      })
    };

    const hashedPassword = await hashPassword(password);
    // Create user in database
    const user = await User.create({
      name, 
      email, 
      password: hashedPassword,
    });

    return res.json(user)
  } catch (error) {
    console.log(error)
  }
};

// Login endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({email});
    if(!user) {
      return res.json({
        error: 'User not found'
      })
    }

    // Check password
    const match = await comparePassword(password, user.password)
    if(match) {
      jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.JWT_SECRET, {}, (err, token) => {
        if(err) throw err;
        res.cookie('token', token).json(user)
      })
    }
    if(!match) {
      res.json({
        error:('Passwords do not match')
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const getProfile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedToken) => {
      if (err) throw err;
      
      // Fetch the complete user data from the database
      try {
        const user = await User.findById(decodedToken.id).select('-password');
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        // Return the complete user data including points
        res.json(user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Failed to fetch user profile" });
      }
    });
  } else {
    res.json(null);
  }
};

const updatePoints = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { points } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    if (!Number.isInteger(points) || points <= 0) {
      return res.status(400).json({ error: "Invalid points value" });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      // Fetch the current user to get their existing points
      const currentUser = await User.findById(user.id);
      
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Calculate new total points by adding the quiz points to existing points
      const currentPoints = currentUser.points || 0;
      const newTotalPoints = currentPoints + points;
      
      // Update the user with the new total points
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { points: newTotalPoints }, // Set to the new accumulated total
        { new: true } // Return the updated document
      );

      res.json(updatedUser);
    });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ error: "Failed to update points" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
  updatePoints,
  logoutUser,
}