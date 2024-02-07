export const endPoint =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/api"
    : `http://localhost:4000/api`;
