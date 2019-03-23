//This approach to handle errors, have been changed by express-async-errors npm package.
//However this could be useful if the npm package doesn't work for our app for every reason.
module.exports = function (handler) {
    return async (req, res, next) => {
      try {
        await handler(req, res);
      } 
      catch (ex) {
        next(ex);
      }
    };
};