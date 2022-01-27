import { useLocation } from "react-router-dom";

export const useQueryParams = () => {
  const location = useLocation();
  const searchParams = Object.fromEntries(
    new URLSearchParams(location.search).entries()
  );
  return searchParams;
};
