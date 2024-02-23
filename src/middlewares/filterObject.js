export const setgovernrateIdToBody = (req, res, next) => {
    // Nested route (Create)
    if (!req.body.governrate) req.body.governrate = req.params.governrate;
    next();
  };
  
  // Nested route
  // GET /api/v1/categories/:governrateId/subcategories
  export const createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.governrate) filterObject = { governrate: req.params.governrate };
    req.filterObj = filterObject;
    next();
  };