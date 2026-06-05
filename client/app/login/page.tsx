"use client";

import { FormField } from "@/components/ui/FormField";
import { notification } from "@/utils/notification";
import { motion, type Variants } from "framer-motion";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { MdBolt, MdLock, MdMail } from "react-icons/md";
import "../../i18n";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isDemoAnimating, setIsDemoAnimating] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let raf = 0 as number;
    raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/img/logo-dark-mode.png"
      : "/img/logo-light-mode.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDemoAnimating(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsDemoAnimating(false);

    if (result?.error) {
      notification.errorToast(result.error || "Login failed");
    } else {
      notification.successToast(t("Welcome back!"));
      router.push("/dashboard");
    }
  };

  const handleDemoLogin = () => {
    setIsDemoAnimating(true);
    setEmail("");
    setPassword("");

    const demoEmail =
      process.env.NEXT_PUBLIC_DEMO_EMAIL || "admin@projectflow.com";
    const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "demo12345";

    // Simulate keystrokes/autofill animation
    setTimeout(() => {
      setEmail(demoEmail);
      setTimeout(() => {
        setPassword(demoPassword);
        setTimeout(async () => {
          const result = await signIn("credentials", {
            email: demoEmail,
            password: demoPassword,
            redirect: false,
          });

          setIsDemoAnimating(false);
          if (result?.ok) {
            notification.successToast(t("Demo access granted!"));
            router.push("/dashboard");
          } else {
            notification.errorToast(result?.error || "Demo login failed");
          }
        }, 500);
      }, 400);
    }, 300);
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="bg-animated-gradient min-h-screen text-on-surface antialiased flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-300 h-full min-h-150 max-h-200 bg-surface-container-lowest/40 backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/20 relative animate-fade-in">
        {/* Left Side: Branding / Illustration */}
        <section className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 ">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyAkzt0Lh8dZWf_34twn_9WnXUG5xUR7UbcFqioQUX06NJkBPbWIoLxoRAs07LdtbiKn2fS3XfEaKDg12SRWa4aG6bgFwzP_E7h2cjnAvbT6N5niGucpr5dQNuT3VbzLCwf0sxVxRuWCSCFeFkJZF-n-GTzbdoQ6TL5Xct_qwPMonH0nbQIH1VVcd5v6WlppiNpI6WfoIqaDBbgbx6UzPmMZX0ZR7paXYQZhgy-K_G_VuCyhpEiNSNx0UuOD9ZrfSV-BMp7nFwwec"
              alt="Abstract geometric shapes"
              fill
              className="object-cover mix-blend-overlay"
              unoptimized
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <Image
                src="/img/logo-dark-mode.png"
                alt="ProjectFlow Logo"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <h1 className="font-display-lg text-display-lg text-white tracking-tight">
                {t("ProjectFlow")}
              </h1>
            </div>

            <div className="space-y-6 mt-24">
              <h2 className="font-headline-lg text-headline-lg text-white">
                {t("Master your momentum.")}
              </h2>
              <p className="font-body-lg text-body-lg text-primary-fixed leading-relaxed">
                {t(
                  "Experience the clarity of enterprise-grade project management. Seamlessly align your team, track complex tasks, and deliver with precision.",
                )}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 mt-auto">
            <div className="flex -space-x-3">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdZqIe-3d1BH4Eaeak6eq7SHap8Diep4uQjV2FZGapxGYaN4XkWhxTN5oADB6iw0UWUxZ3DiDOEgssK-LpoCepzm0rUq2obHlPo8Xji46n8ZwG4Bt-SXmQ_jTsCxzk2kW2ze4ogCrVAGn378ctHGCPt8-SOZCPD1U8llOQM2ng57T_wn3kfYRUG5fPCz_L4QJdmLZ389KhaSi07m6jNQdqc43h6LoQESpQZX-WrfLy7i7_-mwZvgZJLtQnvQC_INkDyOfStiny838"
                alt="Team member"
                width={40}
                height={40}
                className="rounded-full border-2 border-primary object-cover"
                unoptimized
              />
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQGDo5bfDZUm9KqMmlBgDEIk1NTWhtgy1zkWQcz6WcX6sMWJHBfgAU3T1WLQ8iFtJPtoBEcAPEOKM76UO6h3RYG5EHZprYhDJXsSn82y7foy_XUr12sj7yTxpSxbgiQNDyXQfRxk9FXnD_oglog7wHSL7rcE1O--jEnmUM2_1CfzqJUK4HTHcC_KXV84XFho4ABDbGrLOfI9fX1CTo0S5QOaszQpA373O1gRNlUm31ssgBcj56Ty-L1Jk4r8LAam3JA-iQM3hCnt0"
                alt="Team member"
                width={40}
                height={40}
                className="rounded-full border-2 border-primary object-cover"
                unoptimized
              />
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0R7CTVPEq2cfgtUaJsfjpo3ui8M4vfJHdeoN3Z8krErrc7uNwYuphE6UNOjEGiGh-_6vV0J31QcgtHRvhV-kGyI_2E9RBfizZPMMppcYFVkknOTzbJ4ZfVKtm_nobXjSILw1YFRUlQa-ONZoHUxkndT581WoGh0uk1IZWldvk8jIQAr3OqVQf1bVB1giQebPH0xAAyraVvvBOFQE39gs3Zw1mf5Kf7KgUU0ttARk8DVWJ8TN_L8veZBamqeNjkVgJz3T_f01op8M"
                alt="Team member"
                width={40}
                height={40}
                className="rounded-full border-2 border-primary object-cover"
                unoptimized
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
            <Image
              src={logoSrc}
              alt="ProjectFlow Logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
              {t("ProjectFlow")}
            </h1>
          </div>

          <div className="max-w-100 w-full mx-auto">
            <div className="mb-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                {t("Welcome back")}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("Please enter your details to sign in.")}
              </p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              id="loginForm"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Email Address */}
              <motion.div variants={itemVariants}>
                <FormField
                  label={t("Email Address")}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<MdMail />}
                  placeholder="name@company.com"
                  isAnimating={isDemoAnimating}
                  required
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <FormField
                  label={t("Password")}
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<MdLock />}
                  placeholder="••••••••"
                  isAnimating={isDemoAnimating}
                  showPasswordToggle={true}
                  required
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between pt-2"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    name="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer transition-colors"
                  />
                  <label
                    className="ml-2 block font-body-md text-body-md text-on-surface-variant cursor-pointer"
                    htmlFor="remember-me"
                  >
                    {t("Remember me")}
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
                    href="#"
                  >
                    {t("Forgot password?")}
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isDemoAnimating}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
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
                  <MdBolt className="text-title-sm-line-height w-5 h-5 text-tertiary-container group-hover:scale-110 transition-transform" />
                  {t("Quick Demo Login")}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isDemoAnimating}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all duration-200 group disabled:opacity-50 cursor-pointer"
                  id="googleLoginBtn"
                >
                  <FcGoogle className="text-title-sm-line-height w-5 h-5 group-hover:scale-110 transition-transform" />
                  {t("Sign in with Google")}
                </button>
              </motion.div>
            </motion.form>

            <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
              {t("Don't have an account?")}{" "}
              <button
                onClick={() => router.push("/signup")}
                className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                {t("Sign Up")}
              </button>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
