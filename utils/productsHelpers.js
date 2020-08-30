const { slugify, removeAnyNonDigitValue } = require('./commonHelpers');

function formatQuery(query) {
  const excludedParams = {
    lang: 1,
    page: 1,
    limit: 1,
    price: 1,
    category: 1,
    sort: 1,
  };

  const dbQuery = {};

  for (const [key, param] of Object.entries(query)) {
    if (!excludedParams[key]) {
      const values = param.split(',');
      const queryExpression = { $in: values };
      dbQuery[`details.${key}.slug`] = queryExpression;
    }

    if (key === 'price') {
      // 'price.ua': { $gte: 20000, $lte: 21000 }
      const price = param.split('-');
      dbQuery[`${key}.${query.lang || 'ua'}`] = {
        $gte: price[0],
        $lte: price[1],
      };
    }
  }

  return dbQuery;
}

function formatSort(sort) {
  console.log(sort);
  if (sort) {
    if (sort === 'asc' || sort === 'desc') {
      return { 'price.ua': sort, priority: 'desc' };
    } else if (sort === 'new') {
      return { createdAt: 'desc', priority: 'desc' };
    } else if (sort === 'popular') {
      return { priority: 'desc', selled: 'desc' };
    } else {
      return { priority: 'desc' };
    }
  } else {
    return { priority: 'desc' };
  }
}

function transformcategoryFilter(details, filters) {
  // Select product details with isFilter flag
  const detailsWithFilterFlag = [];
  for (const [key, detail] of Object.entries(details)) {
    if (detail.isFilter) {
      detailsWithFilterFlag.push({ key, ...detail });
    }
  }

  // Make comparisons and updating
  detailsWithFilterFlag.forEach((detail) => {
    if (detail.type === 'color') {
      filters[detail.key] = updateColorFilter(detail, filters[detail.key]);
    } else if (detail.type === 'measurement') {
      filters[detail.key] = updateMeasurementFilter(
        detail,
        filters[detail.key]
      );
    } else if (detail.type === 'string') {
      filters[detail.key] = updateStringFilter(detail, filters[detail.key]);
    } else {
      return null;
    }
  });

  return filters;
}

function updatePriceFilter(productPrice, filters) {
  const { ua, en } = productPrice;
  let filterPrice = filters.price;

  if (!filterPrice) {
    filterPrice = {
      type: 'price',
      ua: {
        min: ua,
        max: ua,
      },
      en: {
        min: en,
        max: en,
      },
    };
  } else {
    if (filterPrice.ua.min > ua) {
      filterPrice.ua.min = ua;
      filterPrice.en.min = en;
    } else if (filterPrice.ua.max < ua) {
      filterPrice.ua.max = ua;
      filterPrice.en.max = en;
    } else {
      // if neither results return null;
      return null;
    }
  }

  return filterPrice;
}

function updateColorFilter(detail, filter) {
  if (!filter) {
    filter = {
      type: 'color',
      slug: slugify(detail.label.en),
      label: {
        en: detail.label.en,
        ua: detail.label.ua,
      },
      values: [
        {
          en: detail.en,
          ua: detail.ua,
          hex: detail.value,
          slug: detail.slug,
        },
      ],
    };
  } else {
    if (!isExistInArray(filter.values, detail.en)) {
      filter.values.push({
        en: detail.en,
        ua: detail.ua,
        hex: detail.value,
        slug: detail.slug,
      });
    }
  }
  return filter;
}

function updateMeasurementFilter(detail, filter) {
  if (!filter) {
    filter = {
      type: 'measurement',
      slug: slugify(detail.label.en),
      label: {
        en: detail.label.en,
        ua: detail.label.ua,
      },
      units: {
        en: detail.units.en,
        ua: detail.units.ua,
      },
      values: [{ en: detail.value, ua: detail.value, slug: detail.slug }],
    };
  } else {
    if (!isExistInArray(filter.values, detail.value)) {
      filter.values.push({
        en: detail.value,
        ua: detail.value,
        slug: detail.slug,
      });
      filter.values.sort((obj1, obj2) => {
        return (
          removeAnyNonDigitValue(obj1.en) - removeAnyNonDigitValue(obj2.en)
        );
      });
    }
  }
  return filter;
}

function updateStringFilter(detail, filter) {
  if (!filter) {
    filter = {
      type: 'string',
      slug: slugify(detail.label.en),
      label: {
        en: detail.label.en,
        ua: detail.label.ua,
      },
      values: [
        {
          en: detail.en,
          ua: detail.ua,
          slug: detail.slug,
        },
      ],
    };
  } else {
    if (!isExistInArray(filter.values, detail.en)) {
      filter.values.push({
        en: detail.en,
        ua: detail.ua,
        slug: detail.slug,
      });
    }
  }
  return filter;
}

function isExistInArray(array, param) {
  let isExist = false;
  array.forEach((object) => {
    if (object.en === param) {
      isExist = true;
    }
  });
  return isExist;
}

module.exports = {
  formatQuery,
  formatSort,
  transformcategoryFilter,
  updatePriceFilter,
};
