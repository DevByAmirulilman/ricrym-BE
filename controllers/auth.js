import bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';
import Account from '../models/Account.js';
import Session from '../models/SessionSchema.js';
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find the account by email
      const account = await Account.findOne({ email });
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Set session expiry (e.g., 1 hour from now)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1);
  
      // Create a new session
      const session = new Session({
        session_id: uuid(), // Generate a unique session ID
        session_metadata: {
          user_id: account._id,
          ip_address: req.ip || 'Unknown',
          user_agent: req.headers['user-agent'] || 'Unknown',
        },
        expiry_datetime: expiry,
      });
  
      const savedSession = await session.save();
  
      // Return the session ID to the client
      res.status(200).json({
        message: 'Login successful',
        session_id: savedSession.session_id,
        expiry_datetime: savedSession.expiry_datetime,
        account_id:account._id
      });

    } catch (err) {
      console.error('Error during login:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  export const register = async (req,res) => {
    const { username, email, password } = req.body;

    try {
        // Check Username
        if (!username.trim()) {
            return res.status(401).json({ error: 'Username is required' });
        }

        // Check Email
        if (!email.trim()) {
            return res.status(401).json({ error: 'Email is required' });
        }

        // Check password
        if (!password) {
          return res.status(401).json({ error: 'Password is required' });
        }

        //Check Existing Email
        const existingEmail = await Account.findOne({email})
        if(existingEmail){
            return res.status(401).json({ error: 'Email already Exist' });
        }

        //Check Existing Email
        const existingUsername = await Account.findOne({username})
        if(existingUsername){
            return res.status(401).json({ error: 'Username already Exist' });
        }

        //Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        //save account to DB
        const user = await new Account({username:username, email:email, password:hashedPassword})

        // Generate a new 2FA secret
        const secret = speakeasy.generateSecret({
          name: `WiraApp (${user.email})`, // App name and user email
        });
      
        // Save the secret in the account
        user.twoFactorSecret = secret.base32;
        await user.save();

        // Set session expiry (e.g., 1 hour from now)
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
    
        // Create a new session
        const session = new Session({
          session_id: uuid(), // Generate a unique session ID
          session_metadata: {
            user_id: user._id,
            ip_address: req.ip || 'Unknown',
            user_agent: req.headers['user-agent'] || 'Unknown',
          },
          expiry_datetime: expiry,
        });
    
        const savedSession = await session.save();
    
        // Return the session ID to the client
        res.status(200).json({
          user : {
            id:user._id,
            message: 'Register successful',
            name:user.username,
            email:user.email,
            password:user.password,
          },
          session: {
            session_id: savedSession.session_id,
            expiry_datetime: savedSession.expiry_datetime,
          }

        });
      } catch (err) {
        console.error('Error during Register:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

export const generateTwoFactorQR = async (req, res) => {
  try {
    const { accountId } = req.params;

    // Fetch the account and check if it has a 2FA secret
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found or 2FA not set up' });
    }

    // Regenerate the otpauth URL from the saved secret
    const otpauthUrl = `otpauth://totp/WiraApp:${account.email}?secret=${account.twoFactorSecret}&issuer=MyApp`;

    // Generate the QR code as a Base64-encoded string
    const qrCode = await qrcode.toDataURL(otpauthUrl);

    // Respond with the QR code
    res.status(200).json({
      message: 'QR Code generated successfully',
      qrCode, // Base64-encoded image
    });
  } catch (err) {
    console.error('Error generating QR code:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const verifyTwoFactor = async (req, res) => {
  try {
    const { accountId, token } = req.body;
    const account = await Account.findById(accountId);
    console.log(account)
    if (!account) {
      return res.status(404).json({ error: '2FA not enabled or account not found' });
    }

    // Verify the token
    const isVerified = speakeasy.totp.verify({
      secret: account.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isVerified) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    account.isTwoFactorEnabled = true;
    await account.save();

    // Set session expiry (e.g., 1 hour from now)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    // Create a new session
    const session = new Session({
      session_id: uuid(), // Generate a unique session ID
      session_metadata: {
        user_id: account._id,
        ip_address: req.ip || 'Unknown',
        user_agent: req.headers['user-agent'] || 'Unknown',
      },
      expiry_datetime: expiry,
    });

    const savedSession = await session.save();
    res.status(200).json({
      message: 'Login successful',
      session_id: savedSession.session_id,
      expiry_datetime: savedSession.expiry_datetime,
      account_id:account._id
    });

  } catch (err) {
    console.error('Error verifying 2FA:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

