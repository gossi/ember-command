module.exports = {
  root: true,
  // Since `app` is merged with the parent app, which is not guaranteed to have
  // TypeScript installed, we need to restrict ourselves to JavaScript only.
  extends: '@clark/ember'
};
