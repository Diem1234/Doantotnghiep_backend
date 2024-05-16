import { Account } from '../models/Account.js';
import JWT from 'jsonwebtoken';

// const này cũng giống như import


const allowRoles = (role) => {
  // return a middleware
  return async (request, response, next) => {
    try {
      // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get('Authorization').replace('Bearer', '').trim();

    // DECODE TOKEN
    const payload = await JWT.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
      const account = await Account.findById(payload._id).select('-password').lean();

      if (account && account.role === 'admin') {
        return next();
      }

      return response.status(403).json({ message: 'Tài khoản không có quyền thao tác' }); // user is forbidden

    } catch (error) {
      console.log('««««« error »»»»»', error);
      response.status(403).json({ message: 'Forbidden' }); // user is forbidden
    }
  };
};
export default allowRoles;