'use client';

import { useState } from 'react';
import styles from './admin.module.css';
import { loginAdmin } from './actions';

export default function AdminLoginForm({ defaultPassword = 'admin123' }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLoginSubmit(passToTry) {
    const pw = (passToTry !== undefined ? passToTry : password).trim();
    if (!pw) {
      setError('Please enter the admin password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Try Server Action
      const res = await loginAdmin(null, pw);
      if (res && res.success) {
        // Set client cookie too for redundancy
        document.cookie = `imo_admin_session=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        window.location.reload();
        return;
      }

      // 2. If Server Action returned error
      if (res && res.error) {
        // Check if matching default
        if (pw === defaultPassword) {
          document.cookie = `imo_admin_session=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
          window.location.reload();
          return;
        }
        setError(res.error);
        setLoading(false);
        return;
      }
    } catch {
      // 3. Fallback on network/fetch issue on phone
      if (pw === defaultPassword) {
        document.cookie = `imo_admin_session=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        window.location.reload();
        return;
      }
      setError('Login failed. Please try again or tap the default button below.');
    } finally {
      setLoading(false);
    }
  }

  function handleQuickFill() {
    setPassword(defaultPassword);
    handleLoginSubmit(defaultPassword);
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <img src="/imo_files/imo.30ad61b6.png" alt="imo logo" className={styles.logoImg} />
        </div>
        <h1 className={styles.loginTitle}>Admin Control</h1>
        <p className={styles.loginSub}>Enter password to access APK settings</p>

        {/* Native form with server action */}
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

          <div className={styles.quickFillWrap}>
            <p className={styles.hintText}>
              Default password: <code>{defaultPassword}</code>
            </p>
            <button
              type="button"
              className={styles.quickFillBtn}
              onClick={handleQuickFill}
              id="quick-fill-login-btn"
            >
              ⚡ Fill &amp; Login with default password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
