import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { sendForgotPasswordOtp, verifyOtp, resetPassword } from '../api/forgotPasswordApi';

// ── Reusable input ────────────────────────────────────────────────
function InputField({ label, name, type = 'text', value, onChange, placeholder, icon, loading, rightSlot }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="relative group">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}>
            {icon}
          </span>
        )}
        <input
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} required disabled={loading}
          className={`input-field ${icon ? 'pl-10' : ''} ${rightSlot ? 'pr-11' : ''}`}
        />
        {rightSlot}
      </div>
    </div>
  );
}

// ── Step dot indicator ────────────────────────────────────────────
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={
              i < current
                ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', boxShadow: '0 0 12px rgba(124,58,237,0.5)' }
                : i === current
                ? { background: 'rgba(124,58,237,0.25)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.5)' }
                : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            {i < current ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (i + 1)}
          </div>
          {i < total - 1 && (
            <div className="w-8 h-px transition-all duration-300"
              style={{ background: i < current ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

const STEP_LABELS = ['Send OTP', 'Verify OTP', 'Reset Password'];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);          // 0 | 1 | 2
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendForgotPasswordOtp(email);
      toast.success('OTP sent to your email! Check your inbox 📬');
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success('OTP verified! ✅');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset password ────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      toast.success('Password reset successfully! 🎉 Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // ── Eye-toggle button ─────────────────────────────────────────
  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1 rounded"
      style={{ color: 'var(--text-muted)' }}>
      {show
        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
      }
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--surface-1)' }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Forgot Password
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {step === 0 && "We'll send a one-time code to your email"}
            {step === 1 && 'Enter the 6-digit code sent to your inbox'}
            {step === 2 && 'Choose a strong new password'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card">
          <StepIndicator current={step} total={3} />

          {/* ── Step label ── */}
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: '#a78bfa' }}>
            Step {step + 1} — {STEP_LABELS[step]}
          </p>

          {/* ── STEP 0: Email ── */}
          {step === 0 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                loading={loading}
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                {loading ? <><Spinner size="sm" /><span>Sending…</span></> : <><span>Send OTP</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>}
              </button>
            </form>
          )}

          {/* ── STEP 1: OTP ── */}
          {step === 1 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="form-label">One-Time Password</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                  required
                  disabled={loading}
                  className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                />
                <p className="mt-1 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Code sent to <span style={{ color: '#a78bfa' }}>{email}</span> · valid 5 min
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" disabled={loading} onClick={() => setStep(0)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading || otp.length < 6}
                  className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {loading ? <><Spinner size="sm" /><span>Verifying…</span></> : <span>Verify OTP</span>}
                </button>
              </div>
              <button type="button" disabled={loading} onClick={handleSendOtp}
                className="w-full text-sm transition-colors"
                style={{ color: 'var(--text-muted)' }}>
                Didn't receive it?{' '}
                <span style={{ color: '#a78bfa' }} className="font-semibold">Resend</span>
              </button>
            </form>
          )}

          {/* ── STEP 2: New Password ── */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="form-label">New Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    disabled={loading}
                    className="input-field pl-10 pr-11"
                  />
                  <EyeBtn show={showPw} toggle={() => setShowPw(!showPw)} />
                </div>
              </div>

              <div>
                <label className="form-label">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    disabled={loading}
                    className="input-field pl-10 pr-11"
                  />
                  <EyeBtn show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs" style={{ color: '#f87171' }}>Passwords do not match</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                {loading
                  ? <><Spinner size="sm" /><span>Resetting…</span></>
                  : <><span>Reset Password</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></>
                }
              </button>
            </form>
          )}

          {/* Back to login */}
          <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Remembered it?{' '}
              <Link to="/login" className="font-semibold transition-colors" style={{ color: '#a78bfa' }}>
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          🔒 OTP expires in 5 minutes
        </p>
      </div>
    </div>
  );
}
