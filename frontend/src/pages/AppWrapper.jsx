import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { supabase } from "../supabase";
import { setUser } from "../redux/api/authSlice";
import { logOutUser } from "../redux/api/authSlice";

const AppWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const restoreSession = async () => {
      // ✅ If JWT user already in Redux, skip
      if (token && user && !user.app_metadata) return;

      // ✅ Step 1: Check JWT token if present
      const storedToken = localStorage.getItem("token");
      if (storedToken && (!user || user.app_metadata)) {
        try {
          localStorage.clear();
          const res = await axios.get("http://localhost:5000/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          dispatch(setUser({ user: res.data.user, token: storedToken }));
          return;
        } catch (err) {
          console.error("JWT verification failed:", err);
          localStorage.removeItem("token");
          dispatch(logOutUser());
        }
      }

      // ✅ Step 2: Check Supabase session for OAuth users
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Supabase session error:", error);
        return;
      }

      if (session?.user) {
        dispatch(
          setUser({
            user: session.user,
            token: session.access_token,
            session,
          })
        );
      }
    };

    restoreSession();

    // ✅ Step 3: Sync Supabase login/logout events
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          dispatch(
            setUser({
              user: session.user,
              token: session.access_token,
              session,
            })
          );
        } else {
          dispatch(logOutUser());
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [dispatch, token, user]);

  return children;
};

export default AppWrapper;
