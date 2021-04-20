const { alias, configPaths } = require('react-app-rewire-alias');

/**
 * Override the webpack.config.js from create-react-app.
 * @see https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
 */
module.exports = (config) => {
  config = cssModuleCamelCase(config);
  config = alias(configPaths('./tsconfig.paths.json'))(config);
  return config;
};

/**
 * Allow using camelCase to locate kebab-case css class name.
 * @see https://webpack.js.org/loaders/css-loader/#object
 */
function cssModuleCamelCase(config) {
  const rules = config.module.rules.find((rule) => !!rule.oneOf).oneOf;
  const styleLoaderRule = rules.find((rule) => {
    const regExp = rule.test?.source;
    // original regex: /\.module\.(scss|sass)$/
    return regExp?.includes('module') && regExp?.includes('scss');
  });

  const cssLoader = styleLoaderRule.use.find((rule) => rule?.loader?.includes('/css-loader/'));
  cssLoader.options.modules = {
    ...cssLoader.options.modules,
    exportLocalsConvention: 'camelCase',
  };

  return config;
}
