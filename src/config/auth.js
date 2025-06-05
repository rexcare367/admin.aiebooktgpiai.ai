import { Amplify } from 'aws-amplify';

const adminConfig = {
  Auth: {
    Cognito: {
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_ADMIN_POOL_ID,
      userPoolClientId: process.env.REACT_APP_ADMIN_CLIENT_ID,
    },
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_ADMIN_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_ADMIN_CLIENT_ID,
  }
};

const userConfig = {
  Auth: {
    Cognito: {
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolClientId: process.env.REACT_APP_USER_CLIENT_ID,
    },
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_CLIENT_ID,
  }
};

export const switchUserPool = (poolType = 'admin') => {
  const config = poolType === 'admin' ? adminConfig : userConfig;
  console.log('Switching to pool:', poolType, config);
  Amplify.configure(config);
};

// Initialize with admin pool
switchUserPool('admin');