module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore source map warnings from node_modules
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
      ];

      // Also exclude node_modules from source-map-loader
      const rules = webpackConfig.module.rules;
      
      // Find the oneOf rule which contains source-map-loader
      const oneOfRule = rules.find((rule) => rule.oneOf);
      if (oneOfRule && oneOfRule.oneOf) {
        oneOfRule.oneOf.forEach((rule) => {
          if (rule.use && Array.isArray(rule.use)) {
            const hasSourceMapLoader = rule.use.some((use) => {
              if (typeof use === 'string') {
                return use.includes('source-map-loader');
              }
              return use.loader && use.loader.includes('source-map-loader');
            });
            
            if (hasSourceMapLoader) {
              // Exclude node_modules from this rule
              if (!rule.exclude) {
                rule.exclude = /node_modules/;
              } else if (Array.isArray(rule.exclude)) {
                if (!rule.exclude.some((ex) => ex.toString() === /node_modules/.toString())) {
                  rule.exclude.push(/node_modules/);
                }
              } else {
                rule.exclude = [rule.exclude, /node_modules/];
              }
            }
          }
        });
      }

      return webpackConfig;
    },
  },
};
