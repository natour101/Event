export const unwrapResource = value => {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  if (Object.prototype.hasOwnProperty.call(value, 'data')) {
    return value.data;
  }
  return value;
};

export const unwrapCollection = value => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.data)) return value.data;
  return [];
};
