# API Integration Guide

## Overview

This guide explains how to integrate APIs with the enterprise architecture. The system uses Axios with centralized error handling, automatic retry logic, and JWT token management.

## File Structure

```
src/api/
├── index.ts                    # Exports
├── axiosInstance.ts            # Axios configuration
├── apiService.ts               # Base API service
├── errorHandler.ts             # Error handling
└── services/
    ├── authService.ts
    └── productService.ts
```

## Setup

### 1. Axios Instance Configuration

**File:** `src/api/axiosInstance.ts`

```typescript
// Automatically configured with:
// - Base URL from .env (VITE_API_BASE_URL)
// - Default timeout from .env (VITE_API_TIMEOUT)
// - Authorization header injection
// - Request/Response interceptors
// - 401 auto-logout
// - Exponential backoff retry logic

import axiosInstance from "@/api/axiosInstance";

// Direct usage (not recommended)
axiosInstance.get("/users");
```

### 2. API Service

**File:** `src/api/apiService.ts`

Base service with CRUD methods:

```typescript
import { ApiService } from "@/api";

// GET
const response = await ApiService.get<User>("/users/profile");

// POST
const response = await ApiService.post<User>("/users", userData);

// PUT
const response = await ApiService.put<User>("/users/1", updateData);

// PATCH
const response = await ApiService.patch<User>("/users/1", patchData);

// DELETE
await ApiService.delete("/users/1");

// With pagination
const params = ApiService.buildPaginationParams({
  page: 1,
  pageSize: 10,
  search: "query",
  sortBy: "name",
  sortOrder: "asc"
});
const response = await ApiService.get(`/users?${params}`);
```

## Creating API Services

### Pattern

1. Create service class for each feature
2. Use `ApiService` for HTTP calls
3. Handle errors with `handleApiError`
4. Export from `src/api/index.ts`

### Example: User Service

```typescript
// src/api/services/userService.ts

import { ApiService } from "../apiService";
import { API_PATHS } from "@/config";
import { User, PaginationParams } from "@/types";

export class UserService {
  // GET single
  static async getUser(id: string) {
    return ApiService.get<User>(API_PATHS.USERS.GET(id));
  }

  // GET all with pagination
  static async getUsers(params?: PaginationParams) {
    const query = params ? `?${ApiService.buildPaginationParams(params)}` : "";
    return ApiService.get(`${API_PATHS.USERS.LIST}${query}`);
  }

  // POST
  static async createUser(data: Omit<User, "id" | "createdAt">) {
    return ApiService.post<User>(API_PATHS.USERS.CREATE, data);
  }

  // PUT
  static async updateUser(id: string, data: Partial<User>) {
    return ApiService.put<User>(API_PATHS.USERS.UPDATE(id), data);
  }

  // DELETE
  static async deleteUser(id: string) {
    return ApiService.delete(API_PATHS.USERS.DELETE(id));
  }

  // Custom endpoints
  static async searchUsers(query: string) {
    return ApiService.get(`${API_PATHS.USERS.LIST}?search=${query}`);
  }

  static async getUsersByRole(role: string) {
    return ApiService.get(`${API_PATHS.USERS.LIST}?role=${role}`);
  }
}
```

## API Endpoints Configuration

**File:** `src/config/index.ts`

```typescript
export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
  },
  PRODUCTS: {
    LIST: "/products",
    CREATE: "/products",
    GET: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
};
```

## Error Handling

**File:** `src/api/errorHandler.ts`

### Formatted Error Structure

```typescript
interface FormattedError {
  message: string;              // User-friendly message
  statusCode: number;           // HTTP status code
  code?: string;                // Error code from API
  details?: Record<string, unknown>; // Validation details
  isNetworkError: boolean;      // Network error flag
  isValidationError: boolean;   // Validation error flag
}
```

### Handling Errors

```typescript
import { handleApiError } from "@/api";

try {
  const response = await ApiService.get("/users");
} catch (error) {
  const formattedError = handleApiError(error);
  
  console.log(formattedError.message);      // "User not found"
  console.log(formattedError.statusCode);   // 404
  console.log(formattedError.isNetworkError); // false
  
  // Show error to user
  if (formattedError.isValidationError) {
    // Handle validation errors
    showValidationErrors(formattedError.details);
  } else if (formattedError.isNetworkError) {
    // Handle network errors
    showNetworkError();
  } else {
    // Handle other errors
    showErrorMessage(formattedError.message);
  }
}
```

### Error Status Codes

| Status | Meaning | Handled |
|--------|---------|---------|
| 400 | Bad Request | Yes |
| 401 | Unauthorized | Yes (Auto-logout) |
| 403 | Forbidden | Yes |
| 404 | Not Found | Yes |
| 408 | Timeout | Yes (Retry) |
| 422 | Validation Error | Yes |
| 429 | Too Many Requests | Yes (Retry) |
| 500 | Server Error | Yes (Retry) |
| 502 | Bad Gateway | Yes (Retry) |
| 503 | Service Unavailable | Yes (Retry) |
| 504 | Gateway Timeout | Yes (Retry) |

## Request/Response Format

### Standard Response Format

```typescript
// Success Response
{
  success: true,
  data: { /* data */ },
  message?: "Operation successful"
}

// Error Response
{
  success: false,
  message: "Error message",
  code?: "ERROR_CODE",
  error?: "Detailed error",
  details?: { /* validation errors */ }
}
```

### Request Headers

Automatically added:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Custom Headers

```typescript
const response = await ApiService.get("/users", {
  headers: {
    "X-Custom-Header": "value"
  }
});
```

## Timeout and Retry Logic

### Configuration

**File:** `src/config/index.ts`

```typescript
export const API_RETRY = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,                    // 1 second
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};
```

### Behavior

- Initial request fails with status 500
- Wait 1 second, retry (delay × 2^(retry-1))
- Wait 2 seconds, retry
- Wait 4 seconds, retry
- After 3 retries, return error

### Custom Timeout

```typescript
const response = await ApiService.get("/slow-endpoint", {
  timeout: 60000 // 60 seconds
});
```

## Authentication Flow

### 1. Login

```typescript
import { AuthService } from "@/api/services/authService";

const response = await AuthService.login({
  email: "user@example.com",
  password: "password123"
});

// Automatically stores:
// - localStorage.auth_token = accessToken
// - localStorage.refresh_token = refreshToken
// - localStorage.user_data = user
```

### 2. Token Injection

Automatically added to every request:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 3. Token Refresh

```typescript
const response = await AuthService.refreshToken();
// Token automatically updated
```

### 4. Logout

```typescript
await AuthService.logout();
// Clears all tokens and redirects to login
```

### 5. Auto-logout on 401

```typescript
// Automatically triggered when:
// 1. Token expires (401 response)
// 2. User session invalid
// 3. Unauthorized access

// Actions taken:
// - Clear localStorage
// - Clear Redux state
// - Redirect to /login
```

## Using Services in Components

### With Redux

```typescript
// src/store/slices/userSlice.ts
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await UserService.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
```

### With Hooks

```typescript
// src/hooks/useUsers.ts
export const useUsers = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users);

  return {
    ...users,
    fetchUsers: (params) => dispatch(fetchUsers(params)),
  };
};
```

### In Components

```typescript
import { useUsers } from "@/hooks";
import { toast } from "sonner";

export const UsersList = () => {
  const { items, loading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers({ page: 1, pageSize: 10 });
  }, []);

  if (error) {
    toast.error(error);
  }

  return (
    <div>
      {loading && <Loader />}
      {items.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

## Adding New Endpoints

### Step 1: Add to Config

```typescript
// src/config/index.ts
export const API_PATHS = {
  ORDERS: {
    LIST: "/orders",
    CREATE: "/orders",
    GET: (id: string) => `/orders/${id}`,
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    SHIP: (id: string) => `/orders/${id}/ship`,
  },
};
```

### Step 2: Create Service

```typescript
// src/api/services/orderService.ts
export class OrderService {
  static async getOrders(params?: PaginationParams) {
    const query = params ? `?${ApiService.buildPaginationParams(params)}` : "";
    return ApiService.get(`${API_PATHS.ORDERS.LIST}${query}`);
  }

  static async getOrder(id: string) {
    return ApiService.get(API_PATHS.ORDERS.GET(id));
  }

  static async createOrder(data: any) {
    return ApiService.post(API_PATHS.ORDERS.CREATE, data);
  }

  static async cancelOrder(id: string) {
    return ApiService.post(API_PATHS.ORDERS.CANCEL(id));
  }

  static async shipOrder(id: string, trackingInfo: any) {
    return ApiService.post(API_PATHS.ORDERS.SHIP(id), trackingInfo);
  }
}
```

### Step 3: Create Redux Slice

```typescript
// src/store/slices/orderSlice.ts
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await OrderService.getOrders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.items = action.payload.data;
    });
  },
});

export default orderSlice.reducer;
```

### Step 4: Create Custom Hook

```typescript
// src/hooks/useOrders.ts
export const useOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(state => state.orders);

  return {
    ...orders,
    fetchOrders: (params) => dispatch(fetchOrders(params)),
  };
};
```

### Step 5: Add to Store

```typescript
// src/store/store.ts
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    orders: orderReducer,
  },
});
```

### Step 6: Export Hook

```typescript
// src/hooks/index.ts
export { useOrders } from "./useOrders";
```

## Best Practices

### 1. Centralize API Calls

Always use services, never call API directly from components:

```typescript
// ✓ Good
const response = await UserService.getUsers();

// ✗ Bad
const response = await axiosInstance.get("/users");
```

### 2. Error Handling

Always handle errors properly:

```typescript
// ✓ Good
try {
  await UserService.getUsers();
} catch (error) {
  const formatted = handleApiError(error);
  toast.error(formatted.message);
}

// ✗ Bad
const response = await UserService.getUsers();
```

### 3. Type Safety

Use TypeScript interfaces:

```typescript
// ✓ Good
const response = await ApiService.get<User[]>("/users");

// ✗ Bad
const response = await ApiService.get("/users");
```

### 4. Redux Integration

Use Redux for state management:

```typescript
// ✓ Good
const { items, loading } = useUsers();

// ✗ Bad
const [users, setUsers] = useState([]);
```

### 5. Error Messages

Show user-friendly messages:

```typescript
// ✓ Good
toast.error("Failed to load users");

// ✗ Bad
console.log(error);
```

## Environment Configuration

Update API base URL by environment:

```bash
# Development
VITE_API_BASE_URL=http://localhost:3000/api

# Staging
VITE_API_BASE_URL=https://api.staging.com/api

# Production
VITE_API_BASE_URL=https://api.production.com/api
```

## Troubleshooting

### CORS Errors

- Check backend CORS configuration
- Verify API base URL is correct
- Check authentication headers

### 401 Errors

- Token expired, login required
- Check localStorage for tokens
- Verify token format

### Network Errors

- Check internet connection
- Verify API endpoint is accessible
- Check firewall rules

### Validation Errors (422)

- Check request payload
- Verify required fields
- Check field formats (email, phone, etc.)

## Resources

- [Axios Documentation](https://axios-http.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)
