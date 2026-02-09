export const logAndRethrow = (e: any, log?: (e: any) => any) => {
  const logger = log ?? console.error;
  logger(e);
  throw e;
};
