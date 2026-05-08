import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "@/components/common/FormWrapper";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { validationSchemas } from "@/utils/validationSchemas";
import { toast } from "sonner";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await login(data);
      if (result.payload?.accessToken) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <FormWrapper
          onSubmit={handleSubmit}
          validationSchema={validationSchemas.login}
          className="space-y-4"
        >
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            required
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
          >
            Login
          </Button>
        </FormWrapper>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
