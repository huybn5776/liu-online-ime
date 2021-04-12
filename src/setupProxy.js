/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/hliu/liu-uni.js',
    createProxyMiddleware({
      target: 'https://boshiamy.com',
      changeOrigin: true,
    }),
  );
};
