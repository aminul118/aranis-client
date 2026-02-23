const getFieldError = (state: any, fieldName: string) => {
  if (state && !state.success && state.errors) {
    const error = state.errors.find((err: any) => err.field === fieldName);
    return error ? error.message : null;
  }
  return null;
};

export default getFieldError;
