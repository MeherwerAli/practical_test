// Middleware function that accepts a model and returns counts
module.exports.getCounts = (model) => async (req, res, next) => {
  try {
    const totalDocs = await model.count();
    const totalDeleted = await model.count({ isDeleted: true });
    const totalActive = await model.count({ isActivated: true });
    const totalInactive = await model.count({ isActivated: false });

    res.counts = {
      totalDocs,
      totalDeleted,
      totalActive,
      totalInactive,
    };

    next();
  } catch (error) {
    next(error);
  }
};
