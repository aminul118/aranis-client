const cleanSearchParams = async (
  params: Promise<Record<string, any>>,
): Promise<Record<string, string>> => {
  const resolved = await params;
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(resolved)) {
    if (value != null) result[key] = `${value}`;
  }

  return result;
};

export default cleanSearchParams;
