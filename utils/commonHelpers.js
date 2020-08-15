exports.slugify = (value) => {
  let slug = value
    .trim()
    .toLowerCase()
    .replace(/[\s*+~.()'"!:@%&?]/gim, '-');

  if (slug[slug.length - 1] === '-') {
    return slug.slice(0, -1);
  } else {
    return slug;
  }
};

exports.removeAnyNonDigitValue = (value) => {
  return value.replace(/\D/gm, '');
};
