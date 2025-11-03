import { useSelector } from "react-redux";

export const useAuthReady = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  // Only ready when token and user are available
  return Boolean(token && user);
};
