export const errorConstructor = (message?: string, status?: number) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
