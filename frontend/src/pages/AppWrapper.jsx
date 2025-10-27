// AppWrapper.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../supabase";
import { setUser } from "../redux/api/authSlice";

const AppWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) dispatch(setUser(user));
    };
    checkUser();
  }, [dispatch]);

  return children;
};

export default AppWrapper;
