const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../config/db");

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "Account with this Username or email already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from("users")
      .insert({ username, email, password: hashedPassword })
      .select("*")
      .single();

    if (error) {
      return res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token);

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


async function logoutUser(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        await supabase
            .from('blacklist_tokens')
            .insert({ token });
        
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    }   catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function getUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const { data: user } = await supabase
            .from('users')
            .select('id, username, email')
            .eq('id', userId)
            .single();
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        return res.status(200).json({ user });
    } catch (error) {   
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
};
    
