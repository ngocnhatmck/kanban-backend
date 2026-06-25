/**
 * JWT Configuration
 */

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_super_secret_refresh_key',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
};

export default JWT_CONFIG;
