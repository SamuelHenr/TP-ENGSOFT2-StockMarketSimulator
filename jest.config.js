module.exports = {

  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  "testEnvironmentOptions": {
    "resources": "usable",
    "url": "http://localhost"
  }

}
