const { getCounts } = require('./counts');

const advancedResults = (model, populate) => async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = [
      'select',
      'sort',
      'page',
      'limit',
      'and',
      'exact',
      'password',
    ];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    // Apply "and" or "or" condition
    const andCondition = req.query.and === 'true';
    const orCondition = !andCondition;

    if (Object.keys(reqQuery).length > 0) {
      const operator = andCondition ? '$and' : '$or';
      const queryArr = Object.keys(reqQuery).map((key) => {
        if (req.query.exact === 'true') {
          return { [key]: reqQuery[key] };
        } else {
          return { [key]: { $regex: reqQuery[key], $options: 'i' } };
        }
      });
      query[operator](queryArr);
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalRows = await model.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Populate fields
    if (populate) {
      populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    // Executing query
    const results = await query;

    const counts = getCounts(query);

    // Pagination result
    const pagination = {};

    if (endIndex < totalRows) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    pagination.lastPage = Math.ceil(totalRows / limit);

    pagination.totalRows = totalRows;

    res.advancedResults = {
      success: true,
      count: results?.length ?? 0,
      pagination: pagination ?? {},
      data: results ?? [],
      counts: counts ?? {},
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please, try again later',
    });
  }
};

module.exports = advancedResults;
