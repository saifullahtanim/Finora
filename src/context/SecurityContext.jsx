import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const SecurityContext = createContext();

// Cryptographic helpers using Web Crypto API
export async function hashSecret(secret, salt = 'budget_salt_2026_bd') {
  if (!secret) return '';
  const enc = new TextEncoder();
  const data = enc.encode(`${secret}::${salt}`);
  const hashBuf = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// AES-256-GCM Vault Encryption (PBKDF2 Key Derivation)
export async function encryptVault(dataString, passphrase) {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(dataString)
  );

  return {
    app: 'Finora-Wallet',
    version: '2.0-secure-vault',
    cipher: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA256',
    iterations: 100000,
    salt: Array.from(salt)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
    iv: Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encryptedBuf))),
    createdAt: new Date().toISOString(),
  };
}

export async function decryptVault(payload, passphrase) {
  const enc = new TextEncoder();
  const salt = new Uint8Array(payload.salt.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
  const iv = new Uint8Array(payload.iv.match(/.{1,2}/g).map((b) => parseInt(b, 16)));

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: payload.iterations || 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const binaryString = atob(payload.ciphertext);
  const cipherBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    cipherBytes[i] = binaryString.charCodeAt(i);
  }

  const decryptedBuf = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipherBytes
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuf);
}

export const SecurityProvider = ({ children }) => {
  const { currentUser, isGuest } = useAuth();
  const userId = currentUser?.id || 'guest';

  // 1. Privacy Mode (Hides balance numbers across the UI)
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    try {
      return localStorage.getItem('wallet_privacy_mode') === 'true';
    } catch {
      return false;
    }
  });

  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => {
      const next = !prev;
      localStorage.setItem('wallet_privacy_mode', String(next));
      logSecurityEvent(
        'Privacy Shield',
        next ? 'Masked financial figures enabled' : 'Financial figures unmasked'
      );
      return next;
    });
  };

  // PASSCODE REMOVED COMPLETELY:
  // Purge any stored passcode/PIN keys so no legacy state lingers
  useEffect(() => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('wallet_pin_') || key.startsWith('wallet_autolock_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Could not clean old PIN storage', e);
    }
  }, [userId]);

  // Passcode lock states are permanently disabled
  const isPinEnabled = false;
  const isLocked = false;
  const lockApp = useCallback(() => false, []);
  const unlockApp = useCallback(async () => true, []);
  const setMasterPin = useCallback(async () => true, []);
  const removeMasterPin = useCallback(async () => true, []);
  const resetPasscode = useCallback(async () => true, []);
  const resetPasscodeWithPassword = useCallback(async () => true, []);

  // 2. Audit Activity Log
  const [securityLogs, setSecurityLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(`wallet_security_logs_${userId}`);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'log-init',
          timestamp: new Date().toISOString(),
          type: 'System Boot',
          details: 'Security & cryptographic engine active',
        },
      ];
    } catch {
      return [];
    }
  });

  const logSecurityEvent = useCallback(
    (type, details) => {
      const newLog = {
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        type,
        details,
        userAgent: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser',
      };
      setSecurityLogs((prev) => {
        const updated = [newLog, ...prev.slice(0, 49)];
        try {
          localStorage.setItem(`wallet_security_logs_${userId}`, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    },
    [userId]
  );

  // Keyboard shortcut: Alt + P for Instant Privacy Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        togglePrivacyMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Security Health Assessment & Score (0 - 100)
  const securityHealth = useMemo(() => {
    let score = 50;
    const checklist = [];

    // 1. User Account Status
    if (!isGuest && currentUser?.isVerified) {
      score += 30;
      checklist.push({ title: 'Verified Identity', passed: true, detail: 'Protected under authenticated account with OTP confirmation' });
    } else {
      checklist.push({ title: 'Verified Identity', passed: false, detail: 'Guest mode exploration' });
    }

    // 2. Privacy Shield Readiness
    if (isPrivacyMode) {
      score += 20;
      checklist.push({ title: 'Privacy Shield Active', passed: true, detail: 'All financial balances masked from prying eyes' });
    } else {
      checklist.push({ title: 'Privacy Shield Active', passed: false, detail: 'Toggle Privacy Shield (Alt + P) to mask balances in public' });
    }

    let grade = 'Standard';
    let gradeColor = 'text-blue-500';
    if (score >= 80) {
      grade = 'Bank Grade';
      gradeColor = 'text-emerald-500';
    } else if (score >= 50) {
      grade = 'Standard';
      gradeColor = 'text-blue-500';
    } else {
      grade = 'Needs Attention';
      gradeColor = 'text-rose-500';
    }

    return { score, grade, gradeColor, checklist };
  }, [isGuest, currentUser, isPrivacyMode]);

  return (
    <SecurityContext.Provider
      value={{
        isPrivacyMode,
        togglePrivacyMode,
        isPinEnabled: false,
        isLocked: false,
        lockApp,
        unlockApp,
        setMasterPin,
        removeMasterPin,
        resetPasscode,
        resetPasscodeWithPassword,
        autoLockMinutes: 0,
        updateAutoLock: () => {},
        failedAttempts: 0,
        lockoutUntil: 0,
        securityLogs,
        logSecurityEvent,
        securityHealth,
        encryptVault,
        decryptVault,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    return {
      isPrivacyMode: false,
      togglePrivacyMode: () => {},
      isPinEnabled: false,
      isLocked: false,
      lockApp: () => false,
      unlockApp: async () => true,
      setMasterPin: async () => true,
      removeMasterPin: async () => true,
      resetPasscode: async () => true,
      resetPasscodeWithPassword: async () => true,
      autoLockMinutes: 0,
      updateAutoLock: () => {},
      failedAttempts: 0,
      lockoutUntil: 0,
      securityLogs: [],
      logSecurityEvent: () => {},
      securityHealth: {
        score: 100,
        grade: 'Bank Grade',
        gradeColor: 'text-emerald-500',
        checklist: [],
      },
      encryptVault: async () => ({}),
      decryptVault: async () => '',
    };
  }
  return context;
};

export default SecurityContext;
