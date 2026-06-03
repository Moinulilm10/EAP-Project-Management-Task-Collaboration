"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { MdDashboard, MdMail, MdLock, MdBolt } from "react-icons/md";
import "../../i18n";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isDemoAnimating, setIsDemoAnimating] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/img/logo-dark-mode.png"
    : "/img/logo-light-mode.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication and route to dashboard (home page)
    router.push("/");
  };

  const handleDemoLogin = () => {
    setIsDemoAnimating(true);
    setEmail("");
    setPassword("");

    // Simulate keystrokes/autofill animation
    setTimeout(() => {
      setEmail("admin@projectflow.com");
      setTimeout(() => {
        setPassword("demo12345");
        setTimeout(() => {
          setIsDemoAnimating(false);
          router.push("/");
        }, 500);
      }, 400);
    }, 300);
  };

  return (
    <div className="bg-animated-gradient min-h-screen text-on-surface antialiased flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-[1200px] h-full min-h-[600px] max-h-[800px] bg-surface-container-lowest/40 backdrop-blur-3xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/20 relative animate-fade-in">
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

            <div className="space-y-6 mt-24">
              <h2 className="font-headline-lg text-headline-lg text-white">
                {t("Master your momentum.")}
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

        {/* Right Side: Login Form */}
        <section className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative bg-surface-container-lowest">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <Image src={logoSrc} alt="ProjectFlow Logo" width={28} height={28} className="rounded-lg" />
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
              {t("ProjectFlow")}
            </h1>
          </div>

          <div className="max-w-[400px] w-full mx-auto">
            <div className="mb-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                {t("Welcome back")}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("Please enter your details to sign in.")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" id="loginForm">
              <div className="space-y-1.5">
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
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-surface focus:bg-surface-container-lowest input-glow font-body-md text-body-md text-on-surface transition-all duration-200 ${isDemoAnimating ? "ring-2 ring-primary border-transparent" : "border-outline-variant"
                      }`}
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
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
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-surface focus:bg-surface-container-lowest input-glow font-body-md text-body-md text-on-surface transition-all duration-200 ${isDemoAnimating ? "ring-2 ring-primary border-transparent" : "border-outline-variant"
                      }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    name="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer transition-colors"
                  />
                  <label className="ml-2 block font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="remember-me">
                    {t("Remember me")}
                  </label>
                </div>
                <div className="text-sm">
                  <a className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors" href="#">
                    {t("Forgot password?")}
                  </a>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isDemoAnimating}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:-translate-y-[2px] disabled:opacity-50 cursor-pointer"
                >
                  {t("Sign In")}
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
                  onClick={handleDemoLogin}
                  disabled={isDemoAnimating}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all duration-200 group disabled:opacity-50 cursor-pointer"
                  id="demoLoginBtn"
                >
                  <MdBolt className="text-[20px] w-5 h-5 text-tertiary-container group-hover:scale-110 transition-transform" />
                  {t("Quick Demo Login")}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  disabled={isDemoAnimating}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all duration-200 group disabled:opacity-50 cursor-pointer"
                  id="googleLoginBtn"
                >
                  <FcGoogle className="text-[20px] w-5 h-5 group-hover:scale-110 transition-transform" />
                  {t("Sign in with Google")}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
              {t("Don't have an account?")}{" "}
              <a className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors" href="#">
                {t("Request Access")}
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
