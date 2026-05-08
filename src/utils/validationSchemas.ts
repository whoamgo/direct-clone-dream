import * as Yup from "yup";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validationSchemas = {
  login: Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .matches(emailRegex, "Please enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  }),

  register: Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .matches(emailRegex, "Please enter a valid email")
      .required("Email is required"),
    firstName: Yup.string().optional(),
    lastName: Yup.string().optional(),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must contain uppercase, lowercase, number, and special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  }),

  forgotPassword: Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .matches(emailRegex, "Please enter a valid email")
      .required("Email is required"),
  }),

  resetPassword: Yup.object({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must contain uppercase, lowercase, number, and special character"
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  }),

  changePassword: Yup.object({
    currentPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must contain uppercase, lowercase, number, and special character"
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  }),

  product: Yup.object({
    name: Yup.string()
      .min(3, "Product name must be at least 3 characters")
      .max(100, "Product name must not exceed 100 characters")
      .required("Product name is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must not exceed 500 characters")
      .required("Description is required"),
    price: Yup.number()
      .min(0.01, "Price must be greater than 0")
      .required("Price is required"),
    category: Yup.string()
      .min(2, "Category must be at least 2 characters")
      .required("Category is required"),
    image: Yup.string()
      .url("Image must be a valid URL")
      .required("Image URL is required"),
  }),
};
