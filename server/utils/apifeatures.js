class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering with operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default sort by newest
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Exclude version field by default
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // Add pagination info to the instance
    this.pagination = {
      page,
      limit,
      skip
    };

    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search;
      this.query = this.query.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      });
    }

    return this;
  }

  // Geospatial filtering
  near(lat, lng, maxDistance, field = 'location.coordinates') {
    if (lat && lng) {
      this.query = this.query.find({
        [field]: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: maxDistance * 1000 // Convert km to meters
          }
        }
      });
    }

    return this;
  }

  // Price range filtering
  priceRange(minField = 'price', maxField = 'price') {
    if (this.queryString.minPrice || this.queryString.maxPrice) {
      const priceFilter = {};
      
      if (this.queryString.minPrice) {
        priceFilter.$gte = parseFloat(this.queryString.minPrice);
      }
      
      if (this.queryString.maxPrice) {
        priceFilter.$lte = parseFloat(this.queryString.maxPrice);
      }
      
      this.query = this.query.where(minField, priceFilter);
    }

    return this;
  }

  // Date range filtering
  dateRange(field = 'createdAt') {
    if (this.queryString.startDate || this.queryString.endDate) {
      const dateFilter = {};
      
      if (this.queryString.startDate) {
        dateFilter.$gte = new Date(this.queryString.startDate);
      }
      
      if (this.queryString.endDate) {
        dateFilter.$lte = new Date(this.queryString.endDate);
      }
      
      this.query = this.query.where(field, dateFilter);
    }

    return this;
  }

  // Category filtering
  categoryFilter(field = 'category') {
    if (this.queryString.category) {
      const categories = this.queryString.category.split(',');
      this.query = this.query.where(field).in(categories);
    }

    return this;
  }

  // Status filtering
  statusFilter(field = 'status') {
    if (this.queryString.status) {
      const statuses = this.queryString.status.split(',');
      this.query = this.query.where(field).in(statuses);
    }

    return this;
  }

  // Population
  populate(popOptions) {
    if (popOptions) {
      this.query = this.query.populate(popOptions);
    }

    return this;
  }

  // Text search with weights
  textSearch(fields, weights = {}) {
    if (this.queryString.q) {
      const searchQuery = {
        $text: {
          $search: this.queryString.q,
          $caseSensitive: false,
          $diacriticSensitive: false
        }
      };

      if (Object.keys(weights).length > 0) {
        searchQuery.$text.$language = 'none';
        searchQuery.$text.$weight = weights;
      }

      this.query = this.query.find(searchQuery);
    }

    return this;
  }

  // Get total count of documents (for pagination info)
  async getTotalCount() {
    const countQuery = this.query.model.find(this.query.getFilter());
    return await countQuery.countDocuments();
  }

  // Get pagination info
  async getPaginationInfo() {
    const total = await this.getTotalCount();
    const { page, limit } = this.pagination;
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  // Execute query and return results with pagination info
  async execute() {
    const results = await this.query;
    const paginationInfo = await this.getPaginationInfo();

    return {
      success: true,
      count: results.length,
      pagination: paginationInfo,
      data: results
    };
  }
}

module.exports = APIFeatures;