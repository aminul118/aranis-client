const fetchJson = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return (await res.json()) as T;
};

export default fetchJson;
