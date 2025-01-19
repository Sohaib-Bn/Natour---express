class ApiFeatures {
  constructor(query, queryOptions) {
    this.query = query;
    this.queryOptions = queryOptions;
  }

  fitler() {
    // 1A) STANDART FILLTRATION

    let filterObject = { ...this.queryOptions };
    const excludedQueries = ["page", "sort", "limit", "fields"];
    excludedQueries.forEach(el => delete filterObject[el]);
    // 2B) ADVANCED FILLTRATION
    filterObject = JSON.stringify(filterObject).replace(
      /\b(gte|gt|lt|lte)\b/g,
      match => `$${match}`
    );

    this.query = this.query.find(JSON.parse(filterObject));

    return this;
  }

  sort() {
    if (this.queryOptions.sort) {
      const sortBy = this.queryOptions.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryOptions.fields) {
      const fields = this.queryOptions.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  pagination() {
    const page = +this.queryOptions.page || 1;
    const limit = +this.queryOptions.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
