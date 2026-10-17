// =========================================================
// AUTH STORAGE HELPER
// "Remember Me" checked  -> localStorage   (persists even
//                            after browser restart)
// "Remember Me" unchecked -> sessionStorage (cleared as soon
//                            as the browser/tab is closed)
//
// Reads always check BOTH storages, so every page keeps
// working correctly no matter which one the session lives in.
// =========================================================

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

export type StoredUser = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

export function getAuthToken(): string | null {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY)
  );
}

export function getAuthUser(): StoredUser {
  const raw =
    localStorage.getItem(USER_KEY) ||
    sessionStorage.getItem(USER_KEY);

  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setAuthSession(
  token: string,
  user: StoredUser,
  rememberMe: boolean
) {
  // Dono storages pehle clear kar dein, taaki purana/duplicate
  // session kahi reh na jaye.
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}