import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { sendForgotPasswordOtp, verifyOtp, resetPassword } from '../api/forgotPasswordApi';

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#4a5568' }}>
      {children}
    </label>
  );
}

function StyledInput(props) {
  return (
    <input
      {...props}
      onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.10)'; }}
      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
      style={{ background: '#fff', border: '1.5px solid #e2e8f0', color: '#1a1a2e', ...props.style }}
    />
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={
              i < current
                ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', boxShadow: '0 0 12px rgba(124,58,237,0.35)' }
                : i === current
                ? { background: 'rgba(124,58,237,0.12)', color: '#7c3aed', border: '1.5px solid rgba(124,58,237,0.4)' }
                : { background: '#f1f5f9', color: '#a0aec0', border: '1.5px solid #e2e8f0' }
            }
          >
            {i < current ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (i + 1)}
          </div>
          {i < total - 1 && (
            <div className="w-10 h-0.5 rounded-full transition-all duration-500"
              style={{ background: i < current ? '#7c3aed' : '#e2e8f0' }} />
          )}
        </div>
      ))}
    </div>
  );
}

const STEP_LABELS = ['Send OTP', 'Verify OTP', 'New Password'];
const STEP_SUB = [
  "We'll send a one-time code to your email",
  'Enter the 6-digit code sent to your inbox',
  'Choose a strong new password',
];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    const wakeUp = setTimeout(() => {
      toast('Server is waking up… this may take up to 60 s. Please wait ☕', { icon: '⏳', duration: 8000 });
    }, 5000);
    try {
      await sendForgotPasswordOtp(email);
      clearTimeout(wakeUp);
      toast.success('OTP sent! Check your inbox 📬');
      setStep(1);
    } catch (err) {
      clearTimeout(wakeUp);
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      clearTimeout(wakeUp);
      setLoading(false);
    }
  };

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      toast.success('Password reset! Please log in 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const submitBtn = (label, loadLabel) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-1"
      style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'none'; }}
    >
      {loading
        ? <><Spinner size="sm" /><span>{loadLabel}</span></>
        : <><span>{label}</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
      }
    </button>
  );

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Outfit','Inter',sans-serif" }}>

      {/* ── Left Panel: Dark Teal (identical to Login) ── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-2/5 relative overflow-hidden p-12"
        style={{ background: '#11312f' }}
      >
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl"
            style={{ background: 'var(--accent-primary, #7c3aed)' }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Reset Password</h2>
          <p className="text-white/60 text-base leading-relaxed max-w-xs">
            Follow the 3-step process to securely reset your VidStream password.
          </p>

          {/* Step pills */}
          <div className="mt-10 flex flex-col gap-3">
            {['📧 Enter your email', '🔐 Verify OTP code', '🔑 Set new password'].map((f, i) => (
              <div
                key={f}
                className="flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-300"
                style={{
                  background: step === i ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.07)',
                  border: step === i ? '1px solid rgba(124,58,237,0.50)' : '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <span className="text-sm font-medium" style={{ color: step === i ? '#c4b5fd' : 'rgba(255,255,255,0.65)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12" style={{ background: '#f8fffe' }}>
        <div className="w-full max-w-md animate-slide-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#7c3aed' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#11312f' }}>VidStream</span>
          </div>

          {/* Step indicator */}
          <StepIndicator current={step} total={3} />

          {/* Heading */}
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>
              Step {step + 1} — {STEP_LABELS[step]}
            </span>
            <h1 className="text-3xl font-bold mt-1" style={{ color: '#1a1a2e' }}>Forgot Password</h1>
            <p className="text-sm mt-1" style={{ color: '#718096' }}>{STEP_SUB[step]}</p>
          </div>

          {/* ── STEP 0: Email ── */}
          {step === 0 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <FieldLabel>Email Address</FieldLabel>
                <StyledInput
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required disabled={loading}
                />
              </div>
              {submitBtn('Send OTP', 'Sending…')}
            </form>
          )}

          {/* ── STEP 1: OTP ── */}
          {step === 1 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <FieldLabel>One-Time Password</FieldLabel>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                  required
                  disabled={loading}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.10)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  className="w-full rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono outline-none transition-all duration-200"
                  style={{ background: '#fff', border: '1.5px solid #e2e8f0', color: '#1a1a2e' }}
                />
                <p className="mt-1.5 text-xs text-center" style={{ color: '#a0aec0' }}>
                  Code sent to <span style={{ color: '#7c3aed', fontWeight: 600 }}>{email}</span> · valid 5 min
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button" disabled={loading} onClick={() => setStep(0)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ background: '#f1f5f9', color: '#4a5568', border: '1.5px solid #e2e8f0' }}
                >
                  ← Back
                </button>
                <button
                  type="submit" disabled={loading || otp.length < 6}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 4px 14px rgba(124,58,237,0.30)' }}
                >
                  {loading ? <><Spinner size="sm" /><span>Verifying…</span></> : <span>Verify OTP</span>}
                </button>
              </div>
              <button type="button" disabled={loading} onClick={handleSendOtp}
                className="w-full text-sm text-center transition-colors" style={{ color: '#a0aec0' }}>
                Didn't receive it?{' '}
                <span style={{ color: '#7c3aed', fontWeight: 600 }} className="cursor-pointer">Resend</span>
              </button>
            </form>
          )}

          {/* ── STEP 2: New password ── */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <FieldLabel>New Password</FieldLabel>
                <div className="relative">
                  <StyledInput
                    type={showPw ? 'text' : 'password'} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters" required disabled={loading}
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                    style={{ color: '#a0aec0' }}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel>Confirm New Password</FieldLabel>
                <div className="relative">
                  <StyledInput
                    type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password" required disabled={loading}
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                    style={{ color: '#a0aec0' }}>
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1.5 text-xs" style={{ color: '#e11d48' }}>Passwords do not match</p>
                )}
              </div>
              {submitBtn('Reset Password', 'Resetting…')}
            </form>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs" style={{ color: '#a0aec0' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          <p className="text-center text-sm" style={{ color: '#718096' }}>
            Remembered it?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#7c3aed' }}>
              Sign in →
            </Link>
          </p>
          <p className="text-center text-xs mt-3" style={{ color: '#a0aec0' }}>🔒 OTP expires in 5 minutes</p>
        </div>
      </div>
    </div>
  );
}
