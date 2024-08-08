export const get = async (path: string) => {
  const res = await fetch(
    `${process.env.PUBLIC_API_URL}${path.slice(1)}`,
    process.env.NODE_ENV === "development"
      ? {
          cache: "no-store",
        }
      : {
          next: { revalidate: 3600 },
        }
  );
  const result = await res.json();
  return result;
};
