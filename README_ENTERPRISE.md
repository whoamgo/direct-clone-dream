# Enterprise React.js Architecture

A complete, production-ready enterprise-level React.js frontend architecture with scalable API handling, state management, authentication, and error handling.

## 🚀 Quick Links

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture reference
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - API integration guide
- **[FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md)** - Visual flow diagrams
- **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - What's been created

## 📦 What's Included

### Core Features
- ✅ **Axios Setup** - Request/response interceptors, auto-retry, auto-logout
- ✅ **Redux Toolkit** - Auth & product state management
- ✅ **Authentication** - Complete login, register, password reset flow
- ✅ **Error Handling** - Centralized error formatting and user messages
- ✅ **Form Management** - React Hook Form + Yup validation
- ✅ **Protected Routes** - Role-based access control
- ✅ **Reusable Components** - Button, Input, Modal, Loader, FormWrapper
- ✅ **Custom Hooks** - useAuth, useProducts, useAppDispatch, useAppSelector
- ✅ **TypeScript** - Full type safety throughout
- ✅ **Environment Config** - Development, staging, production setup

## 🏗️ Architecture

```
API Layer
├── Axios Instance (Interceptors)
├── API Service (CRUD methods)
├── Error Handler (Formatted responses)
└── Feature Services (Auth, Products)

State Management (Redux)
├── Auth Slice (Login, Register, Logout)
├── Product Slice (CRUD Operations)
└── Store Configuration

Custom Hooks
├── useAuth (Authentication)
├── useProducts (Products)
├── useAppDispatch (Redux dispatch)
└── useAppSelector (Redux selector)

UI Components
├── Button (Variants, loading states)
├── Input (Error handling)
├── Modal (Customizable)
├── Loader (Full-screen support)
├── FormWrapper (Form context)
└── FormField (Form field with validation)

Utilities
├── Validation Schemas (Yup)
├── Helper Functions
└── Configuration Constants
```

## 🔧 Installation

```bash
# Install dependencies
npm install

# Configure API
# Edit .env and set VITE_API_BASE_URL
VITE_API_BASE_URL=http://localhost:3000/api

# Start development
npm run dev

# Build for production
npm run build
```

## 📖 Key Concepts

### 1. API Architecture

**Axios Instance** handles:
- JWT token injection
- Request/response formatting
- Auto-logout on 401
- Exponential backoff retry (3 retries)
- Timeout configuration

```typescript
import { ApiService } from "@/api";

// All CRUD operations
await ApiService.get<T>("/endpoint");
await ApiService.post<T>("/endpoint", data);
await ApiService.put<T>("/endpoint/:id", data);
await ApiService.patch<T>("/endpoint/:id", data);
await ApiService.delete("/endpoint/:id");
```

### 2. Redux State Management

**Auth Slice**
```typescript
const { user, isAuthenticated, loading, error } = useAuth();
await auth.login(credentials);
await auth.register(credentials);
```

**Product Slice**
```typescript
const { items, loading, pagination } = useProducts();
await products.fetchProducts({ page: 1, pageSize: 10 });
await products.createProduct(data);
```

### 3. Forms with Validation

```typescript
<FormWrapper
  onSubmit={handleSubmit}
  validationSchema={validationSchemas.login}
>
  <FormField name="email" label="Email" required />
  <FormField name="password" label="Password" type="password" required />
  <Button type="submit">Login</Button>
</FormWrapper>
```

### 4. Protected Routes

```typescript
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole={["admin"]}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

## 📁 File Structure

```
src/
├── api/
│   ├── axiosInstance.ts        # Axios setup
│   ├── apiService.ts           # Base service
│   ├── errorHandler.ts         # Error formatting
│   ├── services/               # Feature services
│   │   ├── authService.ts
│   │   └── productService.ts
│   └── index.ts               # Exports
├── store/
│   ├── store.ts               # Redux store
│   ├── slices/                # Redux slices
│   │   ├── authSlice.ts
│   │   └── productSlice.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   └── index.ts
├── components/
│   ├── ProtectedRoute.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Loader.tsx
│       ├── FormWrapper.tsx
│       └── FormField.tsx
├── config/
│   └── index.ts               # Config & constants
├── types/
│   └── index.ts               # TypeScript types
├── utils/
│   ├── validationSchemas.ts
│   └── helpers.ts
├── pages/
│   ├── LoginPage.tsx
│   └── ProductsPage.tsx
└── App.tsx                    # Main app
```

## 🔐 Authentication

### Login Flow
1. User enters credentials
2. Validation passes (Yup schema)
3. Dispatch `login` action
4. `AuthService.login()` makes API call
5. Tokens stored in localStorage
6. Redux state updated
7. Redirect to dashboard

### Auto-logout
- On 401 response
- Clears localStorage
- Clears Redux state
- Redirects to login

### Token Management
- Auto-injected in Authorization header
- Stored in localStorage
- Refresh token support
- Automatic token updates

## 🛡️ Error Handling

### Error Types Handled
| Type | Status | Action |
|------|--------|--------|
| Network | 0 | Show error message |
| Timeout | 408 | Retry with backoff |
| Unauthorized | 401 | Auto-logout |
| Forbidden | 403 | Show error message |
| Not Found | 404 | Show error message |
| Validation | 422 | Show field errors |
| Server | 500+ | Retry with backoff |

### Error Formatting
```typescript
interface FormattedError {
  message: string;              // User-friendly
  statusCode: number;           // HTTP status
  code?: string;                // Error code
  details?: { /* validation */ };
  isNetworkError: boolean;
  isValidationError: boolean;
}
```

## 🎯 Common Tasks

### Add New API Endpoint

1. **Config** (`src/config/index.ts`)
```typescript
USERS: {
  GET_PROFILE: "/users/profile",
}
```

2. **Service** (`src/api/services/userService.ts`)
```typescript
static async getProfile() {
  return ApiService.get(API_PATHS.USERS.GET_PROFILE);
}
```

3. **Redux Slice** (`src/store/slices/userSlice.ts`)
```typescript
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
```

4. **Hook** (`src/hooks/useUser.ts`)
```typescript
export const useUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  return {
    ...user,
    getProfile: () => dispatch(getProfile()),
  };
};
```

### Create New Page

1. Import hooks and components
2. Fetch data on mount
3. Handle loading/error states
4. Render data

```typescript
import { useProducts } from "@/hooks";
import { Button, Loader } from "@/components";

export const ProductsPage = () => {
  const { items, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts({ page: 1, pageSize: 10 });
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {items.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

## 📊 Performance

- Code splitting by Vite
- Lazy loading components
- Memoized selectors
- Optimized re-renders
- API request caching

## 🧪 Testing

Example test structure:
```typescript
describe("AuthService", () => {
  it("should login user with valid credentials", async () => {
    const response = await AuthService.login(credentials);
    expect(response.data.accessToken).toBeDefined();
  });
});
```

## 📱 Environment Configuration

### Development
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
```

### Staging
```env
VITE_API_BASE_URL=https://api.staging.com/api
VITE_ENV=staging
```

### Production
```env
VITE_API_BASE_URL=https://api.production.com/api
VITE_ENV=production
```

## 🚀 Deployment

```bash
# Build
npm run build

# Preview
npm run preview

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Or any static host
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Setup and basic usage
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete reference
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - API patterns
- **[FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md)** - Visual diagrams
- **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - What's created

## 🔗 Tech Stack

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Validation
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Vite** - Build tool

## 💡 Best Practices

1. **Always use services** - Never call API directly
2. **Use Redux** - For global state
3. **Handle errors** - Show user-friendly messages
4. **Validate forms** - Use Yup schemas
5. **Type everything** - Use TypeScript
6. **Reuse components** - DRY principle
7. **Lazy load** - Code split routes
8. **Optimize** - Memoize expensive operations

## 🆘 Support

1. Check documentation files
2. Review example pages (LoginPage, ProductsPage)
3. Check types in `src/types/index.ts`
4. Review Redux slices for patterns

## ✨ What Makes This Special

- ✅ **Production-ready** - Not a boilerplate
- ✅ **Scalable** - Handles large apps
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Error handling** - Comprehensive
- ✅ **Authentication** - Complete flow
- ✅ **State management** - Redux Toolkit
- ✅ **Form handling** - React Hook Form
- ✅ **API integration** - Centralized
- ✅ **Documentation** - Comprehensive
- ✅ **Examples** - Login & CRUD pages

## 🎓 Learning Path

1. Read **QUICK_START.md**
2. Review **ARCHITECTURE.md**
3. Check **API_INTEGRATION.md**
4. Study example pages
5. Review Redux slices
6. Examine type definitions
7. Build your features

## 📝 License

This architecture is provided as-is for production use.

## 🎉 Ready to Build!

The enterprise architecture is now set up and ready. All files have been created following production best practices.

**Next steps:**
1. Update `VITE_API_BASE_URL` in `.env`
2. Run `npm run dev`
3. Check LoginPage example
4. Review ProductsPage CRUD example
5. Build your features!

Happy coding! 🚀
