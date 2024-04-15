// Flattens all object properties to the outermost level
function flatten(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return {
      ...acc,
      ...(typeof value === "object" && value !== null && !Array.isArray(value)
        ? flatten(value)
        : { [key]: value }),
    };
  }, {});
}

module.exports = { flatten };
