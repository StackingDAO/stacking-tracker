export const get = async (path: string) => {
  const res = await fetch(`${process.env.PUBLIC_API_URL}${path.slice(1)}`, {
    cache: "no-store",
  });
  const result = await res.json();
  return result;
};
