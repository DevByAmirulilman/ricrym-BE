import Account from "../models/Account.js";
import Session from "../models/SessionSchema.js";

export const authenticateSession = async (req, res, next) => {
    try {
      const sessionId = req.headers['authorization'] || req.cookies.session_id;
  
      if (!sessionId) {
        return res.status(401).json({ error: 'Session ID is required' });
      }
  
      const session = await Session.findOne({ session_id: sessionId });
      if (!session) {
        return res.status(401).json({ error: 'Invalid session' });
      }
  
      if (new Date() > session.expiry_datetime) {
        return res.status(401).json({ error: 'Session expired' });
      }
  
      req.user = {
        userId: session.session_metadata.user_id,
      };
  
      next(); // Only call next() if the session is valid
    } catch (err) {
      console.error('Error authenticating session:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
   

export const isAdmin = async (req, res, next) => {
    const { accountId } = req.params;
    try {
        const account = await Account.findById(accountId)
        if(account.role !== 1){
            return res.status(401).send('Unauthorized')
        } else {
            next()
        }
    }
    catch(err) {
        console.log(err)
    }
}