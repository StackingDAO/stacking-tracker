import axios from "axios";

export const get = async (path: string) => {
  const instance = axios.create({
    baseURL: process.env.PUBLIC_API_URL,
  });

  const result = await instance.get(path);
  return result.data as any;
};
