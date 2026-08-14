'use client';

import { useState } from 'react';
import styles from './admin.module.css';
import { loginAdmin } from './actions';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLoginSubmit() {
    const pw = password.trim();
    if (!pw) {
      setError('Please enter the admin password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Server Action verification
      const res = await loginAdmin(null, pw);
      if (res && res.success) {
        document.cookie = `imo_admin_session=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        window.location.reload();
        return;
      }

      if (res && res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
    } catch {
      setError('Authentication failed. Please check your password and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <img src="/imo_files/imo.30ad61b6.png" alt="imo logo" className={styles.logoImg} />
        </div>
        <h1 className={styles.loginTitle}>Admin Control</h1>
        <p className={styles.loginSub}>Enter password to access APK settings</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLoginSubmit();
          }}
          className={styles.loginForm}
        >
          <div className={styles.inputWrapper}>
            <input
              id="admin-password-input"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={styles.loginInput}
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              required
            />
            <button
              type="button"
              className={styles.showPwBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button
            type="submit"
            className={styles.btnPrimaryLarge}
            id="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Verifying…' : 'Login to Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
