import React, { createContext, useContext, useState, useEffect } from 'react';
import { getInitialDemoData, getFreshUserData } from '../utils/demoData';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '../firebase';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'wallet_auth_users';
const ACTIVE_USER_ID_KEY = 'wallet_active_user_id';

// Helper to generate elegant initials avatar
const getInitialsAvatar = (name = 'User') => {
  const initial = (name.trim()[0] || 'U').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10B981" />
        <stop offset="100%" stop-color="#0F766E" />
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="36" fill="url(#grad)" />
    <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="56" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">${initial}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const DEFAULT_GUEST_USER = {
  id: 'usr-guest-demo',
  name: 'Demo Explorer (Guest)',
  email: 'guest@wallet.app',
  currency: 'BDT',
  avatar: getInitialsAvatar('Demo'),
  isGuest: true,
  createdAt: new Date().toISOString(),
};

// Seed sample verified users for fast login demo
export const SAMPLE_USERS = [
  {
    id: 'usr-verified-saifulla',
    name: 'Saifulla Tanim',
    email: 'tanim@budget.bd',
    password: 'password123',
    currency: 'BDT',
    avatar: getInitialsAvatar('Tanim'),
    isGuest: false,
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-saifulla-gmail',
    name: 'Saifulla Tanim',
    email: 'saifulla.tanim@gmail.com',
    password: 'password123',
    currency: 'BDT',
    avatar: getInitialsAvatar('Saifulla'),
    isGuest: false,
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-finora-demo',
    name: 'John Doe',
    email: 'john.doe@finora.app',
    password: 'password123',
    currency: 'BDT',
    avatar: getInitialsAvatar('John'),
    isGuest: false,
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-finora-admin',
    name: 'Finora Admin',
    email: 'admin@finora.app',
    password: 'password123',
    currency: 'BDT',
    avatar: getInitialsAvatar('Admin'),
    isGuest: false,
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  DEFAULT_GUEST_USER,
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure standard users exist in stored list
        const merged = [...parsed];
        SAMPLE_USERS.forEach((su) => {
          if (!merged.some((u) => u.email.toLowerCase() === su.email.toLowerCase())) {
            merged.push(su);
          }
        });
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SAMPLE_USERS));
      return SAMPLE_USERS;
    } catch (e) {
      console.error('Error loading users:', e);
      return SAMPLE_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
      if (activeId) {
        if (activeId === DEFAULT_GUEST_USER.id) {
          return DEFAULT_GUEST_USER;
        }
        const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const found = storedUsers.find((u) => u.id === activeId);
        if (found) return found;
      }
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
      return null;
    } catch (e) {
      return null;
    }
  });

  const [pendingVerification, setPendingVerification] = useState(null);

  // Initialize guest and sample user datasets
  useEffect(() => {
    const demoDataKey = `wallet_data_${DEFAULT_GUEST_USER.id}`;
    if (!localStorage.getItem(demoDataKey)) {
      localStorage.setItem(demoDataKey, JSON.stringify(getInitialDemoData('BDT')));
    }
    const sampleUser = SAMPLE_USERS[0];
    if (sampleUser) {
      const sampleDataKey = `wallet_data_${sampleUser.id}`;
      if (!localStorage.getItem(sampleDataKey)) {
        localStorage.setItem(sampleDataKey, JSON.stringify(getFreshUserData('BDT')));
      }
    }
  }, []);

  // Step 1: Request 6-digit OTP code for registration
  const requestRegistrationCode = ({ name, email, password, currency = 'BDT' }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail && !u.isGuest);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const pendingData = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      currency,
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    setPendingVerification(pendingData);
    return generatedOtp;
  };

  // Step 2: Confirm OTP and finalize account registration -> Push to fresh clean dashboard!
  const verifyAndRegister = (enteredCode) => {
    if (!pendingVerification) {
      throw new Error('No pending registration session found. Please fill out the form.');
    }

    if (Date.now() > pendingVerification.expiresAt) {
      throw new Error('The 6-digit code has expired. Please request a new code.');
    }

    if (pendingVerification.otp !== enteredCode.trim()) {
      throw new Error('Incorrect 6-digit code. Please enter the correct code.');
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: pendingVerification.name,
      email: pendingVerification.email,
      password: pendingVerification.password,
      currency: pendingVerification.currency,
      avatar: getInitialsAvatar(pendingVerification.name),
      isGuest: false,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    // Seed FRESH, CLEAN data for new registered user (Zero transactions, fresh starter wallets!)
    const initialData = getFreshUserData(pendingVerification.currency);
    localStorage.setItem(`wallet_data_${newUser.id}`, JSON.stringify(initialData));

    setCurrentUser(newUser);
    localStorage.setItem(ACTIVE_USER_ID_KEY, newUser.id);
    setPendingVerification(null);
    return newUser;
  };

  const cancelVerification = () => {
    setPendingVerification(null);
  };

  // Direct Quick Registration with Firebase
  const registerDirect = async ({ name, email, password, currency = 'BDT' }) => {
    const cleanName = name ? name.trim() : 'Finora User';
    const normalizedEmail = email.trim().toLowerCase();

    let uid = 'usr-' + Date.now();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      uid = userCredential.user.uid;
      try {
        await updateFirebaseProfile(userCredential.user, { displayName: cleanName });
      } catch (e) {}

      // Send verification link via Firebase to user's real email
      try {
        await sendEmailVerification(userCredential.user);
      } catch (e) {
        console.warn('sendEmailVerification error:', e);
      }

      // Explicitly sign out so unverified user CANNOT enter dashboard!
      await signOut(auth);
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
      setCurrentUser(null);
    } catch (fbErr) {
      console.warn('Firebase registration notice:', fbErr);
      if (fbErr.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please log in.');
      } else if (fbErr.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (fbErr.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(fbErr.message || 'Registration failed. Please try again.');
    }

    const newUser = {
      id: uid,
      name: cleanName,
      email: normalizedEmail,
      currency,
      avatar: getInitialsAvatar(cleanName),
      isGuest: false,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users.filter((u) => u.email?.toLowerCase() !== normalizedEmail), newUser];
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    // Seed clean user workspace data
    const initialData = getFreshUserData(currency);
    localStorage.setItem(`wallet_data_${newUser.id}`, JSON.stringify(initialData));

    // Sync to Firestore
    try {
      setDoc(doc(db, 'users', newUser.id), {
        uid: newUser.id,
        name: newUser.name,
        email: newUser.email,
        currency: newUser.currency,
        createdAt: newUser.createdAt,
        isVerified: false,
      }, { merge: true }).catch(() => {});
    } catch (e) {}

    // Return verification info without logging in!
    return {
      emailSent: true,
      email: normalizedEmail,
      name: cleanName,
    };
  };

  // Standard Login with Firebase
  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const fbUser = userCredential.user;

      // SECURITY GUARD: Check if email has been verified!
      if (!fbUser.emailVerified) {
        await signOut(auth);
        localStorage.removeItem(ACTIVE_USER_ID_KEY);
        setCurrentUser(null);
        throw new Error(`Your email "${normalizedEmail}" is not verified yet! Please check your inbox and click the verification link before logging in.`);
      }

      const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || JSON.stringify(users));
      const existing = storedUsers.find((u) => u.email?.toLowerCase() === normalizedEmail || u.id === fbUser.uid);

      const user = existing || {
        id: fbUser.uid,
        name: fbUser.displayName || 'Finora User',
        email: normalizedEmail,
        currency: 'BDT',
        avatar: fbUser.photoURL || getInitialsAvatar(fbUser.displayName || 'User'),
        isGuest: false,
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      if (!existing) {
        storedUsers.push(user);
        setUsers(storedUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
        const initialData = getFreshUserData('BDT');
        localStorage.setItem(`wallet_data_${user.id}`, JSON.stringify(initialData));
      }

      setCurrentUser(user);
      localStorage.setItem(ACTIVE_USER_ID_KEY, user.id);
      return user;
    } catch (fbErr) {
      console.warn('Firebase login notice:', fbErr);
      if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
        throw new Error('The password you entered is incorrect. Please try again.');
      } else if (fbErr.code === 'auth/wrong-password') {
        throw new Error('The password you entered is incorrect. Please try again.');
      } else if (fbErr.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again in a few moments.');
      }
      throw new Error(fbErr.message || 'Login failed. Please verify your credentials.');
    }
  };

  // Send Password Reset Email via Firebase
  const sendResetPasswordEmail = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
    } catch (fbErr) {
      console.warn('Firebase reset password error:', fbErr);
      if (fbErr.code === 'auth/user-not-found') {
        throw new Error(`No account found with email "${normalizedEmail}".`);
      } else if (fbErr.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(fbErr.message || 'Failed to send reset email.');
    }
  };

  // Resend Verification Email
  const resendVerificationEmail = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
      }
    } catch (err) {
      console.warn('resendVerificationEmail notice:', err);
      throw new Error(err.message || 'Failed to resend verification email.');
    }
  };

  // Local fallback resetPassword
  const resetPassword = (email, newPassword) => {
    const normalizedEmail = email.trim().toLowerCase();
    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || JSON.stringify(users));
    const userIndex = storedUsers.findIndex((u) => u.email?.toLowerCase() === normalizedEmail);
    if (userIndex === -1) {
      throw new Error('No account found with this email address.');
    }
    const targetUser = {
      ...storedUsers[userIndex],
      password: newPassword,
    };
    storedUsers[userIndex] = targetUser;
    setUsers(storedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));

    setCurrentUser(targetUser);
    localStorage.setItem(ACTIVE_USER_ID_KEY, targetUser.id);
    return targetUser;
  };

  // Social User Resolver (creates or links profile and workspace data)
  const loginWithSocialUser = (socialUser) => {
    const cleanEmail = (socialUser.email || '').toLowerCase().trim();
    const existingIndex = users.findIndex(
      (u) => (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) || u.id === socialUser.id
    );

    let finalUser;
    let updatedUsers = [...users];

    if (existingIndex !== -1) {
      finalUser = {
        ...updatedUsers[existingIndex],
        name: socialUser.name || updatedUsers[existingIndex].name,
        email: cleanEmail || updatedUsers[existingIndex].email,
        avatar: socialUser.avatar || updatedUsers[existingIndex].avatar,
        isGuest: false,
      };
      updatedUsers[existingIndex] = finalUser;
    } else {
      finalUser = {
        id: socialUser.id || 'usr-' + Date.now(),
        name: socialUser.name || 'Finora User',
        email: cleanEmail,
        avatar: socialUser.avatar || getInitialsAvatar(socialUser.name || 'User'),
        currency: 'BDT',
        isGuest: false,
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
      updatedUsers.push(finalUser);

      // Seed fresh workspace dataset for this user
      const initialData = getFreshUserData('BDT');
      localStorage.setItem(`wallet_data_${finalUser.id}`, JSON.stringify(initialData));
    }

    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    setCurrentUser(finalUser);
    localStorage.setItem(ACTIVE_USER_ID_KEY, finalUser.id);

    // Sync to Cloud Firestore in background
    try {
      if (finalUser.id) {
        setDoc(doc(db, 'users', finalUser.id), {
          uid: finalUser.id,
          name: finalUser.name,
          email: finalUser.email,
          avatar: finalUser.avatar,
          currency: finalUser.currency || 'BDT',
          lastLoginAt: new Date().toISOString(),
        }, { merge: true }).catch(() => {});
      }
    } catch (e) {}

    return finalUser;
  };

  // Sign In with Google via Firebase Popup
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      return loginWithSocialUser({
        id: fbUser.uid,
        name: fbUser.displayName || 'Google User',
        email: fbUser.email,
        avatar: fbUser.photoURL || getInitialsAvatar(fbUser.displayName || 'G'),
      });
    } catch (err) {
      console.error('Google Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed.');
      } else if (err.code === 'auth/operation-not-allowed') {
        throw new Error('Google Sign-In is not enabled yet in Firebase Console. Please enable it under Authentication > Sign-in method.');
      } else if (err.code === 'auth/unauthorized-domain') {
        throw new Error('Current domain is not authorized in Firebase. Add localhost to Authorized Domains.');
      }
      throw new Error(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  // Sign In with GitHub via Firebase Popup
  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const fbUser = result.user;
      return loginWithSocialUser({
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.reloadUserInfo?.screenName || 'GitHub User',
        email: fbUser.email,
        avatar: fbUser.photoURL || getInitialsAvatar(fbUser.displayName || 'G'),
      });
    } catch (err) {
      console.error('GitHub Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed.');
      } else if (err.code === 'auth/operation-not-allowed') {
        throw new Error('GitHub Sign-In is not enabled yet in Firebase Console. Please enable it under Authentication > Sign-in method.');
      } else if (err.code === 'auth/unauthorized-domain') {
        throw new Error('Current domain is not authorized in Firebase. Add localhost to Authorized Domains.');
      }
      throw new Error(err.message || 'GitHub sign-in failed. Please try again.');
    }
  };

  // Guest Access
  const loginGuest = () => {
    const guestUser = users.find((u) => u.id === DEFAULT_GUEST_USER.id) || DEFAULT_GUEST_USER;
    setCurrentUser(guestUser);
    localStorage.setItem(ACTIVE_USER_ID_KEY, guestUser.id);
    return guestUser;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(ACTIVE_USER_ID_KEY);
    setCurrentUser(null);
  };

  // Update profile details
  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updated : u));
    setUsers(updatedUsers);
    setCurrentUser(updated);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  // Custom Avatar Image Upload handler (supports base64 image data from file picker)
  const updateAvatar = (imageDataUrl) => {
    updateProfile({ avatar: imageDataUrl });
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isGuest: !!currentUser?.isGuest,
        isAuthenticated: !!currentUser,
        pendingVerification,
        requestRegistrationCode,
        verifyAndRegister,
        cancelVerification,
        registerDirect,
        login,
        loginGuest,
        loginWithGoogle,
        loginWithGithub,
        sendResetPasswordEmail,
        resendVerificationEmail,
        resetPassword,
        logout,
        updateProfile,
        updateAvatar,
        getInitialsAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
