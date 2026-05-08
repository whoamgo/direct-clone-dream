# Quick Start Guide

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env` (already provided):

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Enterprise App
VITE_ENV=development
VITE_API_TIMEOUT=30000
```

2. Update `VITE_API_BASE_URL` to your API endpoint.

## Running the Application

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run test     # Run tests
```

## Architecture Overview

The project uses:
- **React 18** - UI library
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Form validation
- **Tailwind CSS** - Styling

## Key Directories

- `src/api/` - API setup and services
- `src/store/` - Redux store and slices
- `src/hooks/` - Custom React hooks
- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/config/` - Configuration constants
- `src/types/` - TypeScript interfaces
- `src/utils/` - Utility functions

## Common Tasks

### Adding a New API Endpoint

1. Add route in `src/config/index.ts`:
```typescript
USERS: {
  GET_PROFILE: "/users/profile",
}
```

2. Create service in `src/api/services/userService.ts`:
```typescript
export class UserService {
  static async getProfile() {
    return ApiService.get(API_PATHS.USERS.GET_PROFILE);
  }
}
```

### Creating a New Redux Slice

1. Create file `src/store/slices/featureSlice.ts`
2. Define initial state, async thunks, and reducers
3. Add to store in `src/store/store.ts`
4. Create custom hook in `src/hooks/useFeature.ts`

### Creating a New Page

1. Create component in `src/pages/FeaturePage.tsx`
2. Add route in `src/App.tsx`
3. Use Redux hooks and components:

```typescript
import { useFeature } from "@/hooks";

export const FeaturePage = () => {
  const { items, loading } = useFeature();
  return <div>{/* render items */}</div>;
};
```

### Using Protected Routes

```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute";

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole={["admin"]}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

## API Integration

### Making API Calls

```typescript
import { ApiService } from "@/api";

// GET
const response = await ApiService.get("/users");

// POST
const response = await ApiService.post("/users", { name: "John" });

// PUT
const response = await ApiService.put("/users/1", { name: "Jane" });

// DELETE
await ApiService.delete("/users/1");
```

### Error Handling

```typescript
import { handleApiError } from "@/api";

try {
  await ApiService.get("/users");
} catch (error) {
  const formattedError = handleApiError(error);
  console.log(formattedError.message);
}
```

## Form Handling

### Using Forms with Validation

```typescript
import { FormWrapper } from "@/components/common/FormWrapper";
import { FormField } from "@/components/common/FormField";
import { validationSchemas } from "@/utils/validationSchemas";

<FormWrapper
  onSubmit={handleSubmit}
  validationSchema={validationSchemas.login}
>
  <FormField name="email" label="Email" required />
  <FormField name="password" label="Password" type="password" required />
  <Button type="submit">Login</Button>
</FormWrapper>
```

## Authentication

### Login

```typescript
import { useAuth } from "@/hooks";

const { login, isAuthenticated } = useAuth();

const handleLogin = async (credentials) => {
  await login(credentials);
  // User is automatically logged in if successful
};
```

### Logout

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User is logged out
};
```

### Protected Routes

```typescript
const { isAuthenticated, user } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

## State Management

### Accessing Redux State

```typescript
import { useAppSelector } from "@/hooks";

const auth = useAppSelector((state) => state.auth);
const { user, isAuthenticated } = auth;
```

### Dispatching Actions

```typescript
import { useAppDispatch } from "@/hooks";
import { logout } from "@/store/slices/authSlice";

const dispatch = useAppDispatch();

const handleLogout = () => {
  dispatch(logout());
};
```

## Styling

The project uses Tailwind CSS. Add utility classes directly to JSX:

```typescript
<div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
  Button
</div>
```

## Debugging

### Redux DevTools

Install Redux DevTools browser extension to inspect state changes.

### Network Requests

Open browser DevTools Network tab to inspect API calls.

### Console Logs

Use `console.log()` in components and Redux thunks for debugging.

## Common Issues

### CORS Errors

Ensure your API endpoint is properly configured in `.env` and backend has CORS enabled.

### 401 Unauthorized

- Check if token is stored in localStorage
- Verify token hasn't expired
- Try logging in again

### Form Validation Not Working

- Ensure FormField is inside FormProvider (from FormWrapper)
- Check validation schema is correct
- Verify field name matches schema

### Redux State Not Updating

- Check Redux DevTools for action dispatches
- Ensure async thunk is returning data correctly
- Check extraReducers is properly handling cases

## Next Steps

1. Customize API endpoints in `src/config/index.ts`
2. Create feature-specific services in `src/api/services/`
3. Create Redux slices in `src/store/slices/`
4. Create pages and components
5. Add routes to `src/App.tsx`

## Resources

- [React Documentation](https://react.dev)
- [Redux Documentation](https://redux.js.org)
- [Axios Documentation](https://axios-http.com)
- [React Hook Form](https://react-hook-form.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Yup Validation](https://github.com/jquense/yup)

## Support

For detailed architecture information, see `ARCHITECTURE.md`.
