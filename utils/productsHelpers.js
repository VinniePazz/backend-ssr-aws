const { slugify, removeAnyNonDigitValue } = require('./commonHelpers');

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
      values: {
        en: [detail.en],
        ua: [detail.ua],
        hex: [detail.value],
        slugs: [slugify(detail.en)],
      },
    };
  } else {
    if (!filter.values.en.includes(detail.en)) {
      filter.values.en.push(detail.en);
      filter.values.ua.push(detail.ua);
      filter.values.hex.push(detail.value);
      filter.values.slugs.push(slugify(detail.en));
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
      values: [detail.value],
    };
  } else {
    if (!filter.values.includes(detail.value)) {
      filter.values.push(detail.value);
      filter.values.sort((a, b) => {
        return removeAnyNonDigitValue(a) - removeAnyNonDigitValue(b);
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
      values: [detail.value],
      slugs: [slugify(detail.value)],
    };
  } else {
    if (!filter.values.includes(detail.value)) {
      filter.values.push(detail.value);
      filter.values.sort((a, b) => {
        return removeAnyNonDigitValue(a) - removeAnyNonDigitValue(b);
      });
    }
  }
  return filter;
}

module.exports = {
  transformcategoryFilter,
  updatePriceFilter,
};
