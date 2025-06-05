export const AUTH_CONFIG = {
  ADMIN: {
    REGION: process.env.REACT_APP_ADMIN_POOL_ID,
    USER_POOL_ID: process.env.REACT_APP_ADMIN_POOL_ID,
    CLIENT_ID: process.env.REACT_APP_ADMIN_CLIENT_ID,
    ADMIN_EMAIL: process.env.REACT_APP_ADMIN_EMAIL
  },
  USER: {
    REGION: process.env.REACT_APP_USER_POOL_ID,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    CLIENT_ID: process.env.REACT_APP_USER_CLIENT_ID
  }
};