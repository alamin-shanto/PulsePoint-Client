// src/Providers/AuthProvider.jsx

import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { app } from "../Firebase/firebase.config";

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // this will hold {uid, email, role, name...}
  const [loading, setLoading] = useState(true);

  // ✅ Firebase: create user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Firebase: email/pass login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Firebase: Google login
  const googleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Firebase: update user profile
  const updateUser = (userInfo) => updateProfile(auth.currentUser, userInfo);
  const removeUser = (user) => deleteUser(user);

  // ✅ Firebase: logout
  const logOut = async () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  // ✅ Auth state change listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        try {
          // 🔒 Get Firebase ID token
          const idToken = await currentUser.getIdToken(true);

          // 🔐 Send ID token to backend to get JWT
          const jwtRes = await axios.post(
            "https://pulse-point-server-blue.vercel.app/jwt",
            { email: currentUser.email },
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          const token = jwtRes.data.token;
          localStorage.setItem("access-token", token);

          // 📥 Get full user info (with role)
          const userRes = await axios.get(
            `https://pulse-point-server-blue.vercel.app/users/${encodeURIComponent(
              currentUser.email
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const userData = userRes.data;
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || userData.name,
            photoURL: currentUser.photoURL,
            role: userData.role || "donor",
            status: userData.status || "active",
          });
        } catch (error) {
          console.error("🔥 Auth error:", error);
          localStorage.removeItem("access-token");
          setUser(null);
        }
      } else {
        localStorage.removeItem("access-token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    googleSignIn,
    updateUser,
    removeUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
