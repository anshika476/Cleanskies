import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navigation from "../components/Navigation";
import { Card } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// Registration schema
const registrationSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be at most 32 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscore allowed"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters"),
});

// Login schema
const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "Username or email is required"),
  password: z
    .string()
    .min(1, "Password is required"),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register: registerUser, isAuthenticated, isLoading } = useAuth();

  // Check URL params for mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    setIsLoginMode(mode === 'login');
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Registration form
  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
  });

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onRegistrationSubmit = async (data: RegistrationFormValues) => {
    setError("");
    try {
      const success = await registerUser(data.username, data.email, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError("Registration failed. Username or email may already exist.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    setError("");
    try {
      const success = await login(data.usernameOrEmail, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError("Invalid username/email or password.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    registrationForm.reset();
    loginForm.reset();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <Card className="p-6 card-3d animate-fade-in">
            <h1 className="text-2xl font-semibold text-center mb-2">
              {isLoginMode ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {isLoginMode 
                ? "Sign in to access your CleanSkies dashboard" 
                : "Sign up to access your CleanSkies dashboard"
              }
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {isLoginMode ? (
              // Login Form
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="usernameOrEmail">Username or Email</Label>
                  <Input
                    id="usernameOrEmail"
                    placeholder="Enter your username or email"
                    {...loginForm.register("usernameOrEmail")}
                  />
                  {loginForm.formState.errors.usernameOrEmail && (
                    <p className="text-xs text-red-500 mt-1">
                      {loginForm.formState.errors.usernameOrEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="loginPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...loginForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label="Toggle password visibility"
                      className="absolute inset-y-0 right-0 px-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full"
                >
                  {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="underline hover:text-foreground"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              // Registration Form
              <form onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="e.g. indus_warrior"
                    {...registrationForm.register("username")}
                  />
                  {registrationForm.formState.errors.username && (
                    <p className="text-xs text-red-500 mt-1">
                      {registrationForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...registrationForm.register("email")}
                  />
                  {registrationForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {registrationForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...registrationForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label="Toggle password visibility"
                      className="absolute inset-y-0 right-0 px-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {registrationForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {registrationForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={registrationForm.formState.isSubmitting}
                  className="w-full"
                >
                  {registrationForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="underline hover:text-foreground"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
