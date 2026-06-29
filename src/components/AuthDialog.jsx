import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import {
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { Mail, Lock, User, CheckCircle2, Phone, ArrowLeft, Key } from "lucide-react";

export function AuthDialog({ trigger }) {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setOtpCode("");
    setOtpSent(false);
    setConfirmationResult(null);
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {
        console.error(e);
      }
      setRecaptchaVerifier(null);
    }
    setError("");
    setSuccess("");
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (activeTab === "signin") {
        await loginWithEmail(email, password);
        setSuccess("Signed in successfully!");
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 1000);
      } else {
        if (!name.trim()) {
          throw new Error("Please enter your name.");
        }
        if (!phone.trim()) {
          throw new Error("Please enter your phone number.");
        }
        if (!phone.startsWith("+")) {
          throw new Error("Phone number must include country code (e.g. +91XXXXXXXXXX).");
        }

        const cred = await signUpWithEmail(email, password, name);

        const userDocRef = doc(db, "user_detail", cred.user.uid);
        await setDoc(userDocRef, {
          name,
          email,
          phone,
          createdAt: new Date().toISOString(),
        });

        setSuccess("Account created successfully!");
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      let msg = err.message || "An authentication error occurred.";
      if (err.code === "auth/invalid-credential") {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already in use.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      let msg = err.message || "Google Sign-In failed.";
      if (err.code === "auth/configuration-not-found") {
        msg = "Google Sign-In is disabled. Please go to Firebase Console -> Authentication -> Sign-in method, click 'Add new provider', and enable 'Google'.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!otpSent) {
        if (!email.trim() || !phone.trim()) {
          throw new Error("Please fill in both Email and Phone Number.");
        }
        if (!phone.startsWith("+")) {
          throw new Error("Phone number must include country code (e.g. +91XXXXXXXXXX).");
        }

        const q = query(
          collection(db, "user_detail"),
          where("email", "==", email),
          where("phone", "==", phone)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("No registered account details match the provided email and phone number.");
        }

        let verifier = recaptchaVerifier;
        if (!verifier) {
          verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {},
          });
          setRecaptchaVerifier(verifier);
        }

        const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
        setConfirmationResult(confirmation);
        setOtpSent(true);
        setSuccess("A 6-digit verification code has been sent to your phone.");
      } else {
        if (!otpCode.trim()) {
          throw new Error("Please enter the 6-digit verification code.");
        }

        await confirmationResult.confirm(otpCode);

        await sendPasswordResetEmail(auth, email);
        setSuccess("Identity verified! A password reset link has been sent to your email address.");
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 4000);
      }
    } catch (err) {
      console.error(err);
      let msg = err.message || "Failed to process password recovery.";
      if (err.code === "auth/invalid-verification-code") {
        msg = "Invalid verification code. Please check and try again.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many requests. Please try again later.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm bg-background border border-border/80 rounded-2xl p-6 shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-display text-primary font-bold">
            {activeTab === "signin"
              ? "Welcome Back"
              : activeTab === "signup"
              ? "Join Pahad Se"
              : "Reset Password"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {activeTab === "signin"
              ? "Sign in to access your saved cart and profile."
              : activeTab === "signup"
              ? "Create an account to save shopping lists and order easily."
              : "Verify your phone number with an OTP to reset your password."}
          </DialogDescription>
        </DialogHeader>

        {activeTab !== "forgot" && (
          <div className="flex w-full rounded-lg bg-secondary p-1 text-xs select-none mt-4">
            <button
              onClick={() => {
                setActiveTab("signin");
                setError("");
              }}
              className={`flex-1 rounded py-1.5 text-center font-medium transition-colors cursor-pointer ${
                activeTab === "signin"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setError("");
              }}
              className={`flex-1 rounded py-1.5 text-center font-medium transition-colors cursor-pointer ${
                activeTab === "signup"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {error && (
          <div className="text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3 mt-4 text-center animate-in fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4 flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="size-4 shrink-0" />
            {success}
          </div>
        )}

        <div id="recaptcha-container" className="hidden"></div>

        {activeTab === "forgot" ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4 mt-4 text-left">
            {!otpSent ? (
              <>
                <div className="space-y-1.5 animate-in fade-in">
                  <Label
                    htmlFor="forgot-email"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      <Mail className="size-4" />
                    </span>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-10 w-full rounded-lg border border-border focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 animate-in fade-in">
                  <Label
                    htmlFor="forgot-phone"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      <Phone className="size-4" />
                    </span>
                    <Input
                      id="forgot-phone"
                      type="tel"
                      placeholder="+919999999999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 h-10 w-full rounded-lg border border-border focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    *Enter number with country code (e.g. +91 for India).
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-1.5 animate-in fade-in">
                <Label
                  htmlFor="forgot-otp"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Verification Code (OTP)
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <Key className="size-4" />
                  </span>
                  <Input
                    id="forgot-otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="pl-9 h-10 w-full rounded-lg border border-border focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold cursor-pointer"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : !otpSent
                ? "Send Verification Code"
                : "Verify & Send Reset Link"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                resetForm();
              }}
              className="text-xs text-primary font-semibold hover:underline flex items-center justify-center gap-1 mx-auto mt-2 cursor-pointer"
            >
              <ArrowLeft className="size-3" /> Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-4 mt-4 text-left">
            {activeTab === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      <User className="size-4" />
                    </span>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Yogesh Negi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 h-10 w-full rounded-lg border border-border focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      <Phone className="size-4" />
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+919999999999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 h-10 w-full rounded-lg border border-border focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    *Enter number with country code (e.g. +91 for India).
                  </p>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Email Address
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Mail className="size-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 w-full rounded-lg border border-border focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Lock className="size-4" />
                </span>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-10 w-full rounded-lg border border-border focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              {activeTab === "signin" && (
                <div className="text-right mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("forgot");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold cursor-pointer animate-in fade-in"
              disabled={loading}
            >
              {loading ? "Please wait..." : activeTab === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        )}

        {activeTab !== "forgot" && (
          <>
            <div className="relative my-6 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full gap-2 font-semibold border-border hover:bg-secondary cursor-pointer"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.8-2.6 3.08l4.08 3.16c2.39-2.2 3.77-5.45 3.77-9.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.08-3.16c-1.13.76-2.58 1.21-3.88 1.21-3.0 0-5.54-2.03-6.44-4.75L1.37 17.51C3.36 21.46 7.42 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.56 14.39A7.17 7.17 0 0 1 5.2 12c0-.82.14-1.63.4-2.39L1.37 6.45A11.96 11.96 0 0 0 0 12c0 2.01.5 3.91 1.37 5.55l4.19-3.16z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.42 0 3.36 2.54 1.37 6.49l4.19 3.16c.9-2.72 3.44-4.75 6.44-4.75z"
                />
              </svg>
              Google
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
