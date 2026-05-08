# Enterprise React Architecture Guide

## Overview

This is a production-ready, scalable enterprise-level React.js architecture designed to handle large-scale applications. It follows industry best practices and includes complete setup for API handling, state management, authentication, and error handling.

## Project Structure

```
src/
├── api/
│   ├── index.ts                 # API exports
│   ├── axiosInstance.ts         # Axios setup with interceptors
│   ├── apiService.ts            # Base API service
│   ├── errorHandler.ts          # Centralized error handling
│   └── services/
│       ├── authService.ts       # Authentication endpoints
│       └── productService.ts    # Product CRUD endpoints
├── store/
│   ├── store.ts                 # Redux store configuration
│   └── slices/
│       ├── authSlice.ts         # Auth state management
│       └── productSlice.ts      # Product state management
├── hooks/
│   ├── index.ts                 # Hooks exports
│   ├── useAppDispatch.ts        # Redux dispatch hook
│   ├── useAppSelector.ts        # Redux selector hook
│   ├── useAuth.ts               # Auth custom hook
│   └── useProducts.ts           # Products custom hook
├── components/
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── common/
│       ├── Button.tsx           # Reusable button component
│       ├── Input.tsx            # Reusable input component
│       ├── Modal.tsx            # Reusable modal component
│       ├── Loader.tsx           # Loading spinner
│       ├── FormWrapper.tsx      # Form wrapper with validation
│       └── FormField.tsx        # Form field component
├── config/
│   └── index.ts                 # Configuration & constants
├── types/
│   └── index.ts                 # TypeScript interfaces
├── utils/
│   ├── validationSchemas.ts    # Yup validation schemas
│   └── helpers.ts               # Utility functions
├── pages/
│   ├── LoginPage.tsx            # Example login page
│   └── ProductsPage.tsx         # Example CRUD page
└── App.tsx                      # Main app component
```

## Key Concepts

### 1. API Architecture

#### Axios Setup with Interceptors

**File:** `src/api/axiosInstance.ts`

- Auto-attaches JWT token to all requests
- Handles 401 unauthorized responses with auto-logout
- Implements exponential backoff retry logic
- Supports timeout configuration

```typescript
// Usage
import { axiosInstance } from "@/api";

const response = await axiosInstance.get("/users");
```

#### Base API Service

**File:** `src/api/apiService.ts`

Provides CRUD methods for consistent API calls:

```typescript
// GET request
const response = await ApiService.get<User>("/users/profile");

// POST request
const response = await ApiService.post<AuthResponse>("/auth/login", credentials);

// PUT/PATCH request
const response = await ApiService.put<Product>("/products/123", updateData);

// DELETE request
await ApiService.delete("/products/123");
```

#### Feature-Specific Services

Each feature has its own service class:

```typescript
// AuthService - src/api/services/authService.ts
import { AuthService } from "@/api/services/authService";

await AuthService.login(credentials);
await AuthService.register(userData);
await AuthService.logout();
await AuthService.refreshToken();
await AuthService.forgotPassword(email);
await AuthService.resetPassword(resetData);
```

```typescript
// ProductService - src/api/services/productService.ts
import { ProductService } from "@/api/services/productService";

const products = await ProductService.getProducts(paginationParams);
const product = await ProductService.getProduct(id);
await ProductService.createProduct(productData);
await ProductService.updateProduct(id, updateData);
await ProductService.deleteProduct(id);
```

### 2. Redux State Management

#### Auth State

**File:** `src/store/slices/authSlice.ts`

```typescript
// State structure
{
  user: User | null,
  accessToken: string | null,
  refreshToken: string | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean,
  emailVerificationPending: boolean,
  passwordResetPending: boolean,
}

// Async thunks
dispatch(login(credentials));
dispatch(register(credentials));
dispatch(logout());
dispatch(getProfile());
dispatch(forgotPassword(email));
dispatch(resetPassword(resetData));
dispatch(changePassword(changeData));
```

#### Product State

**File:** `src/store/slices/productSlice.ts`

```typescript
// State structure
{
  items: Product[],
  selectedProduct: Product | null,
  data: PaginatedResponse<Product> | null,
  loading: boolean,
  error: string | null,
  success: boolean,
  pagination: { total, page, pageSize, totalPages },
  filters: { page, pageSize, search, sortBy, sortOrder },
}

// Async thunks
dispatch(fetchProducts(paginationParams));
dispatch(fetchProduct(id));
dispatch(createProduct(data));
dispatch(updateProduct({ id, data }));
dispatch(deleteProduct(id));
```

### 3. Custom Hooks

#### useAuth

```typescript
import { useAuth } from "@/hooks";

const {
  user,
  isAuthenticated,
  loading,
  error,
  login,
  register,
  logout,
  getProfile,
} = useAuth();
```

#### useProducts

```typescript
import { useProducts } from "@/hooks";

const {
  items,
  loading,
  error,
  pagination,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setFilters,
} = useProducts();
```

### 4. Form Management

#### Validation Schemas

**File:** `src/utils/validationSchemas.ts`

```typescript
import { validationSchemas } from "@/utils/validationSchemas";

// Available schemas
validationSchemas.login
validationSchemas.register
validationSchemas.forgotPassword
validationSchemas.resetPassword
validationSchemas.changePassword
validationSchemas.product
```

#### FormWrapper Component

```typescript
<FormWrapper
  onSubmit={handleSubmit}
  validationSchema={validationSchemas.login}
  defaultValues={{ email: "", password: "" }}
>
  {/* FormField components inside */}
</FormWrapper>
```

#### FormField Component

```typescript
<FormField
  name="email"
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  required
/>

<FormField
  name="password"
  label="Password"
  type="password"
  as="input"
/>

<FormField
  name="category"
  label="Category"
  as="select"
  options={[
    { label: "Electronics", value: "electronics" },
    { label: "Books", value: "books" },
  ]}
/>

<FormField
  name="description"
  label="Description"
  as="textarea"
/>
```

### 5. Error Handling

**File:** `src/api/errorHandler.ts`

Centralized error handling with formatted responses:

```typescript
interface FormattedError {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, unknown>;
  isNetworkError: boolean;
  isValidationError: boolean;
}

// Handles all error types
// - Network errors
// - Timeout errors
// - Validation errors (422)
// - Authentication errors (401)
// - Authorization errors (403)
// - Server errors (500)
```

### 6. Protected Routes

```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute";

<Routes>
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRole={["admin"]}>
        <AdminPanel />
      </ProtectedRoute>
    }
  />
</Routes>
```

## Configuration

### Environment Variables

Update API base URL by changing `.env`:

```env
# Development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development

# Staging
VITE_API_BASE_URL=https://api.staging.com/api
VITE_ENV=staging

# Production
VITE_API_BASE_URL=https://api.production.com/api
VITE_ENV=production
```

### API Configuration

**File:** `src/config/index.ts`

```typescript
export const appConfig = {
  apiBaseUrl,
  appName,
  env,
  apiTimeout,
  isDevelopment,
  isProduction,
  // ... more config
};

export const API_PATHS = {
  AUTH: { LOGIN, REGISTER, LOGOUT, ... },
  USERS: { LIST, GET, CREATE, UPDATE, DELETE, ... },
  PRODUCTS: { LIST, GET, CREATE, UPDATE, DELETE, ... },
};
```

## Usage Examples

### Login Flow

```typescript
import { useAuth } from "@/hooks";
import { FormWrapper } from "@/components/common/FormWrapper";
import { FormField } from "@/components/common/FormField";
import { validationSchemas } from "@/utils/validationSchemas";

export const LoginPage = () => {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (data) => {
    await login(data);
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      validationSchema={validationSchemas.login}
    >
      <FormField name="email" label="Email" required />
      <FormField name="password" label="Password" type="password" required />
      <Button type="submit" isLoading={loading}>
        Login
      </Button>
    </FormWrapper>
  );
};
```

### CRUD Operations

```typescript
import { useProducts } from "@/hooks";

export const ProductsPage = () => {
  const {
    items,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  } = useProducts();

  useEffect(() => {
    fetchProducts({ page: 1, pageSize: 10 });
  }, []);

  const handleCreate = (data) => {
    createProduct(data);
  };

  const handleUpdate = (id, data) => {
    updateProduct(id, data);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
  };

  return (
    <div>
      {loading && <Loader />}
      {items.map((product) => (
        <div key={product.id}>
          {/* Render product */}
          <Button onClick={() => handleDelete(product.id)}>Delete</Button>
        </div>
      ))}
    </div>
  );
};
```

## Best Practices

### 1. API Service Pattern

Always create specific service classes for different features:

```typescript
export class UsersService {
  static async getUsers() { /* ... */ }
  static async getUser(id) { /* ... */ }
  static async createUser(data) { /* ... */ }
  static async updateUser(id, data) { /* ... */ }
  static async deleteUser(id) { /* ... */ }
}
```

### 2. Redux Async Thunks

Keep thunks focused and handle errors properly:

```typescript
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await UsersService.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 3. Error Handling

Always show user-friendly error messages:

```typescript
try {
  await login(credentials);
} catch (error) {
  const formattedError = handleApiError(error);
  toast.error(formattedError.message);
}
```

### 4. Form Validation

Use Yup schemas for consistent validation:

```typescript
const schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
});
```

### 5. Component Reusability

Create generic, reusable components:

```typescript
// Generic Button
<Button variant="primary" size="lg" isLoading={loading}>
  Submit
</Button>

// Generic Modal
<Modal
  isOpen={open}
  onClose={handleClose}
  title="Confirm Action"
>
  Are you sure?
</Modal>
```

## Performance Optimization

### 1. Code Splitting

Routes are automatically code-split by Vite.

### 2. Memoization

```typescript
const MemoizedComponent = memo(Component);
```

### 3. API Caching

Implement caching in service layer or use TanStack Query.

### 4. Image Optimization

Use optimized images and lazy loading.

## Testing

Create tests for:
- API services
- Redux slices
- Components
- Validation schemas
- Custom hooks

## Deployment

1. Build project: `npm run build`
2. Optimize bundle with `npm run build:dev` for development mode
3. Set appropriate environment variables
4. Deploy to hosting (Vercel, Netlify, AWS, etc.)

## Adding New Features

### 1. Create API Service

```typescript
// src/api/services/newFeatureService.ts
export class NewFeatureService {
  static async getItems() { /* ... */ }
}
```

### 2. Create Redux Slice

```typescript
// src/store/slices/newFeatureSlice.ts
export const newFeatureSlice = createSlice({ /* ... */ });
```

### 3. Create Custom Hook

```typescript
// src/hooks/useNewFeature.ts
export const useNewFeature = () => { /* ... */ };
```

### 4. Create Components

```typescript
// src/components/NewFeature.tsx
export const NewFeature = () => { /* ... */ };
```

## Support & Documentation

For issues or questions, refer to:
- Redux Documentation: https://redux.js.org
- Axios Documentation: https://axios-http.com
- React Hook Form: https://react-hook-form.com
- Yup Validation: https://github.com/jquense/yup
