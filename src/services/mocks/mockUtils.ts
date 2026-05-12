const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const MOCK_DELAY = {
  FAST: 200,
  NORMAL: 500,
  SLOW: 1000,
};

export const withDelay = async <T>(data: T, delay = MOCK_DELAY.NORMAL): Promise<T> => {
  await wait(delay);
  return data;
};

export const mockError = async (message: string, status: number, delay = MOCK_DELAY.NORMAL): Promise<never> => {
  await wait(delay);
  throw { response: { status, data: { success: false, message } } };
};

export const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return {
    data,
    pagination: {
      total: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
    },
  };
};
