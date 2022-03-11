import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "@firebase/auth";
import { auth, handleSignOut } from "./firebase";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  return { currentUser, loading, handleSignOut };
};
