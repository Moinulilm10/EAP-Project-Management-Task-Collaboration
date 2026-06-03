"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { MdPerson, MdMail, MdLock, MdCheck, MdClose } from "react-icons/md";
import "../../i18n";

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  
  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showConfirmError, setShowConfirmError] = useState(false);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Password Strength State
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => setMounted(true), []);

  // Calculate Password Strength in real time
  useEffect(() => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    setPasswordStrength({
      score,
      hasMinLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
    });
  }, [password]);

  // Check matching password validation on input change
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setShowConfirmError(true);
    } else {
      setShowConfirmError(false);
    }
  }, [password, confirmPassword]);

  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/img/logo-dark-mode.png"
    : "/img/logo-light-mode.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setShowConfirmError(true);
      return;
    }
    if (passwordStrength.score < 4) {
      return;
    }
    if (!agreeTerms) return;
    
    // Simulate signup success and route to dashboard (home page)
    router.push("/");
  };

  // Get Strength Color and Label details
  const getStrengthMeta = () => {
    if (!password) return { label: "", colorClass: "bg-outline-variant/30", scoreColorClass: "text-outline" };
    switch (passwordStrength.score) {
      case 1:
      case 2:
        return { label: t("Weak"), colorClass: "bg-error", scoreColorClass: "text-error" };
      case 3:
        return { label: t("Medium"), colorClass: "bg-secondary", scoreColorClass: "text-secondary" };
      case 4:
        return { label: t("Good"), colorClass: "bg-primary", scoreColorClass: "text-primary" };
      case 5:
        return { label: t("Strong"), colorClass: "bg-tertiary-fixed-dim", scoreColorClass: "text-tertiary-fixed-dim" };
      default:
        return { label: "", colorClass: "bg-outline-variant/30", scoreColorClass: "text-outline" };
    }
  };

  const strengthMeta = getStrengthMeta();

  // Validate form readiness
  const isPasswordValid = passwordStrength.score >= 4;
  const passwordsMatch = password === confirmPassword;
  const canSubmit = name && email && isPasswordValid && passwordsMatch && agreeTerms;

  return (
    <div className="bg-animated-gradient min-h-screen text-on-surface antialiased flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-[1200px] h-full min-h-[600px] max-h-[950px] bg-surface-container-lowest/40 backdrop-blur-3xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/20 relative animate-fade-in">
        {/* Left Side: Branding / Illustration */}
        <section className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              alt="Abstract geometric shapes"
              className="w-full h-full object-cover mix-blend-overlay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyAkzt0Lh8dZWf_34twn_9WnXUG5xUR7UbcFqioQUX06NJkBPbWIoLxoRAs07LdtbiKn2fS3XfEaKDg12SRWa4aG6bgFwzP_E7h2cjnAvbT6N5niGucpr5dQNuT3VbzLCwf0sxVxRuWCSCFeFkJZF-n-GTzbdoQ6TL5Xct_qwPMonH0nbQIH1VVcd5v6WlppiNpI6WfoIqaDBbgbx6UzPmMZX0ZR7paXYQZhgy-K_G_VuCyhpEiNSNx0UuOD9ZrfSV-BMp7nFwwec"
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <Image src="/img/logo-dark-mode.png" alt="ProjectFlow Logo" width={40} height={40} className="rounded-lg" />
              <h1 className="font-display-lg text-display-lg text-white tracking-tight">
                {t("ProjectFlow")}
              </h1>
            </div>

            <div className="space-y-6 mt-20">
              <h2 className="font-headline-lg text-headline-lg text-white">
                {t("Join ProjectFlow today.")}
              </h2>
              <p className="font-body-lg text-body-lg text-primary-fixed leading-relaxed">
                {t("Experience the clarity of enterprise-grade project management. Seamlessly align your team, track complex tasks, and deliver with precision.")}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 mt-auto">
            <div className="flex -space-x-3">
              <img
                alt="Team member"
                className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdZqIe-3d1BH4Eaeak6eq7SHap8Diep4uQjV2FZGapxGYaN4XkWhxTN5oADB6iw0UWUxZ3DiDOEgssK-LpoCepzm0rUq2obHlPo8Xji46n8ZwG4Bt-SXmQ_jTsCxzk2kW2ze4ogCrVAGn378ctHGCPt8-SOZCPD1U8llOQM2ng57T_wn3kfYRUG5fPCz_L4QJdmLZ389KhaSi07m6jNQdqc43h6LoQESpQZX-WrfLy7i7_-mwZvgZJLtQnvQC_INkDyOfStiny838"
              />
              <img
                alt="Team member"
                className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQGDo5bfDZUm9KqMmlBgDEIk1NTWhtgy1zkWQcz6WcX6sMWJHBfgAU3T1WLQ8iFtJPtoBEcAPEOKM76UO6h3RYG5EHZprYhDJXsSn82y7foy_XUr12sj7yTxpSxbgiQNDyXQfRxk9FXnD_oglog7wHSL7rcE1O--jEnmUM2_1CfzqJUK4HTHcC_KXV84XFho4ABDbGrLOfI9fX1CTo0S5QOaszQpA373O1gRNlUm31ssgBcj56Ty-L1Jk4r8LAam3JA-iQM3hCnt0"
              />
              <img
                alt="Team member"
                className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0R7CTVPEq2cfgtUaJsfjpo3ui8M4vfJHdeoN3Z8krErrc7uNwYuphE6UNOjEGiGh-_6vV0J31QcgtHRvhV-kGyI_2E9RBfizZPMMppcYFVkknOTzbJ4ZfVKtm_nobXjSILw1YFRUlQa-ONZoHUxkndT581WoGh0uk1IZWldvk8jIQAr3OqVQf1bVB1giQebPH0xAAyraVvvBOFQE39gs3Zw1mf5Kf7KgUU0ttARk8DVWJ8TN_L8veZBamqeNjkVgJz3T_f01op8M"
              />
            </div>
            <div className="text-sm font-body-md text-primary-fixed">
              {t("Trusted by 10,000+ teams")}
            </div>
          </div>
        </section>

        {/* Right Side: Signup Form */}
        <section className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col justify-center relative bg-surface-container-lowest overflow-y-auto">
          <div className="md:hidden flex items-center gap-2 mb-6">
            <Image src={logoSrc} alt="ProjectFlow Logo" width={28} height={28} className="rounded-lg" />
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
              {t("ProjectFlow")}
            </h1>
          </div>

          <div className="max-w-[400px] w-full mx-auto">
            <div className="mb-5">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
                {t("Create your account")}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("Start tracking tasks and collaborating today.")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5" id="signupForm">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="name">
                  {t("Full Name")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdPerson className="text-outline text-[20px] w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface focus:bg-surface-container-lowest input-glow font-body-md text-body-md text-on-surface transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="email">
                  {t("Email Address")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdMail className="text-outline text-[20px] w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface focus:bg-surface-container-lowest input-glow font-body-md text-body-md text-on-surface transition-all duration-200"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="password">
                  {t("Password")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="text-outline text-[20px] w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface focus:bg-surface-container-lowest input-glow font-body-md text-body-md text-on-surface transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Password Strength Indicator UI */}
                {password && (
                  <div className="mt-2 space-y-2 p-2 bg-surface-container/30 border border-outline-variant/30 rounded-lg animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {t("Password Strength")}
                      </span>
                      <span className={`font-label-sm text-label-sm font-bold ${strengthMeta.scoreColorClass}`}>
                        {strengthMeta.label}
                      </span>
                    </div>

                    {/* Progress Bar Segments */}
                    <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.score >= level
                              ? strengthMeta.colorClass
                              : "bg-outline-variant/20"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Password criteria checklist */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1">
                      <div className="flex items-center gap-1">
                        {passwordStrength.hasMinLength ? (
                          <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
                        ) : (
                          <MdClose className="text-outline w-3.5 h-3.5" />
                        )}
                        <span className={`text-[10px] font-medium leading-none ${passwordStrength.hasMinLength ? "text-on-surface" : "text-on-surface-variant/60"}`}>
                          {t("Min. 8 characters")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {passwordStrength.hasUpper ? (
                          <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
                        ) : (
                          <MdClose className="text-outline w-3.5 h-3.5" />
                        )}
                        <span className={`text-[10px] font-medium leading-none ${passwordStrength.hasUpper ? "text-on-surface" : "text-on-surface-variant/60"}`}>
                          {t("Uppercase letter")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {passwordStrength.hasLower ? (
                          <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
                        ) : (
                          <MdClose className="text-outline w-3.5 h-3.5" />
                        )}
                        <span className={`text-[10px] font-medium leading-none ${passwordStrength.hasLower ? "text-on-surface" : "text-on-surface-variant/60"}`}>
                          {t("Lowercase letter")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {passwordStrength.hasNumber ? (
                          <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
                        ) : (
                          <MdClose className="text-outline w-3.5 h-3.5" />
                        )}
                        <span className={`text-[10px] font-medium leading-none ${passwordStrength.hasNumber ? "text-on-surface" : "text-on-surface-variant/60"}`}>
                          {t("Number (0-9)")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 col-span-2">
                        {passwordStrength.hasSpecial ? (
                          <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
                        ) : (
                          <MdClose className="text-outline w-3.5 h-3.5" />
                        )}
                        <span className={`text-[10px] font-medium leading-none ${passwordStrength.hasSpecial ? "text-on-surface" : "text-on-surface-variant/60"}`}>
                          {t("Special character (@, #, $, etc.)")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="confirmPassword">
                  {t("Confirm Password")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="text-outline text-[20px] w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg bg-surface focus:bg-surface-container-lowest input-glow font-body-md text-body-md text-on-surface transition-all duration-200 ${
                      showConfirmError ? "border-error focus:ring-error/50" : "border-outline-variant"
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {showConfirmError && (
                  <p className="text-[10px] font-semibold text-error mt-1 animate-fade-in">
                    {t("Passwords do not match.")}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-1">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    name="agree-terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer transition-colors"
                    required
                  />
                </div>
                <div className="ml-2 text-sm leading-5">
                  <label htmlFor="agree-terms" className="font-body-md text-body-md text-on-surface-variant cursor-pointer">
                    {t("I agree to the")}{" "}
                    <a href="#" className="text-primary hover:underline">{t("Terms of Service")}</a>{" "}
                    {t("and")}{" "}
                    <a href="#" className="text-primary hover:underline">{t("Privacy Policy")}</a>
                  </label>
                </div>
              </div>

              {/* Submit / Actions */}
              <div className="pt-2 space-y-3.5">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:-translate-y-[2px] disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed cursor-pointer"
                >
                  {t("Sign Up")}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-surface-container-lowest font-label-sm text-label-sm text-on-surface-variant uppercase">
                      {t("Or continue with")}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all duration-200 group cursor-pointer"
                  id="googleSignupBtn"
                >
                  <FcGoogle className="text-[20px] w-5 h-5 group-hover:scale-110 transition-transform" />
                  {t("Sign up with Google")}
                </button>
              </div>
            </form>

            <p className="mt-5 text-center font-body-md text-body-md text-on-surface-variant">
              {t("Already have an account?")}{" "}
              <button
                onClick={() => router.push("/login")}
                className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                {t("Sign In")}
              </button>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
