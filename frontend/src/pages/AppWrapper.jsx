import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { supabase } from "../supabase";
import { setUser, logOutUser } from "../redux/api/authSlice";

const AppWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const restoreSession = async () => {
      // ✅ Step 1: Try restoring JWT user from localStorage
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const res = await axios.get("http://bookstore.local/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.data?.valid && res.data?.user) {
            dispatch(setUser({ user: res.data.user, token: storedToken }));
            console.log("✅ JWT session restored:", res.data.user);
            return; // Stop here if JWT is valid
          }
        } catch (err) {
          console.error("❌ JWT verification failed:", err);
          localStorage.removeItem("token");
        }
      }

      // ✅ Step 2: Try restoring Supabase session (OAuth login)
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("❌ Supabase session error:", error);
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
        console.log("✅ Supabase session restored:", session.user);
      } else {
        console.log("No active session found.");
      }
    };

    restoreSession();

    // ✅ Step 3: Supabase login/logout event listener
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(
          setUser({
            user: session.user,
            token: session.access_token,
            session,
          })
        );
        console.log("🔄 Supabase auth state changed: logged in");
      } else {
        dispatch(logOutUser());
        console.log("🔄 Supabase auth state changed: logged out");
      }
    });

    // ✅ Step 4: Cleanup listener on unmount
    return () => subscription.subscription.unsubscribe();
  }, [dispatch]);

  return children;
};

export default AppWrapper;
