# Architecture Flow Diagrams

## Authentication Flow

```
┌─────────────────┐
│  Login Page     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ FormWrapper +               │
│ FormField (Email/Password)  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Yup Validation              │
│ validationSchemas.login     │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ useAuth().login()            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Redux: login(credentials)    │
│ (authSlice.ts)               │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ AuthService.login()          │
│ (authService.ts)             │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ ApiService.post()            │
│ (apiService.ts)              │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Axios Instance               │
│ - Adds Authorization header  │
│ - Sets timeout               │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ API Request                  │
│ POST /auth/login             │
└────────┬─────────────────────┘
         │
         ├─── Success (200) ────┐
         │                      ▼
         │              ┌────────────────────┐
         │              │ Store tokens in:   │
         │              │ - localStorage     │
         │              │ - Redux store      │
         │              └────────────────────┘
         │                      │
         │                      ▼
         │              ┌────────────────────┐
         │              │ Redirect to        │
         │              │ Dashboard          │
         │              └────────────────────┘
         │
         └─── Error ────┐
                        ▼
                ┌────────────────────┐
                │ handleApiError()   │
                │ Format Error       │
                └────────┬───────────┘
                         │
                         ▼
                ┌────────────────────┐
                │ Show Toast Error   │
                │ "Invalid email"    │
                └────────────────────┘
```

## Request Flow

```
Component
   │
   ▼
useAuth() / useProducts()
   │
   ▼
Redux Thunk (e.g., login, fetchProducts)
   │
   ▼
Service Class (AuthService, ProductService)
   │
   ▼
ApiService.get/post/put/delete()
   │
   ▼
Axios Instance
   │
   ├─ Request Interceptor
   │  ├─ Add JWT Token
   │  ├─ Set Headers
   │  └─ Set Timeout
   │
   ▼
API Endpoint
   │
   ├─ Success Response
   │  ▼
   │  Response Interceptor
   │  │
   │  ├─ Check Status
   │  ├─ Return Data
   │  └─ Update Redux
   │
   └─ Error Response
      ▼
      Error Interceptor
      │
      ├─ 401 Unauthorized
      │  ├─ Clear Tokens
      │  ├─ Clear Redux
      │  └─ Redirect to Login
      │
      ├─ Network Error
      │  ├─ Check Retry Count
      │  ├─ Exponential Backoff
      │  └─ Retry or Return Error
      │
      └─ Format Error
         ├─ Extract Message
         ├─ Get Status Code
         └─ Return Formatted Error
```

## Redux State Flow

```
User Interaction (Login Button Click)
      │
      ▼
Dispatch Action (login with credentials)
      │
      ▼
Redux Thunk
      │
      ├─ Pending
      │  ├─ state.loading = true
      │  └─ state.error = null
      │
      ▼
      │
      ├─ Fulfilled
      │  ├─ state.loading = false
      │  ├─ state.user = action.payload.user
      │  ├─ state.accessToken = token
      │  ├─ state.refreshToken = token
      │  └─ state.isAuthenticated = true
      │
      └─ Rejected
         ├─ state.loading = false
         ├─ state.error = action.payload
         └─ state.isAuthenticated = false
      
      ▼
Component Re-renders with New State
      │
      ▼
Display Updated UI
```

## Error Handling Flow

```
API Request
   │
   ▼
Response Error
   │
   ├─ Network Error
   │  ├─ No Response Status
   │  ├─ Code: ECONNABORTED
   │  │
   │  └─ handleApiError()
   │     │
   │     ├─ isNetworkError: true
   │     ├─ message: "Network connection error..."
   │     └─ statusCode: 0
   │
   ├─ HTTP Error Status
   │  │
   │  ├─ 401 Unauthorized
   │  │  ├─ Clear localStorage
   │  │  ├─ Clear Redux
   │  │  └─ Redirect to /login
   │  │
   │  ├─ 422 Validation Error
   │  │  ├─ isValidationError: true
   │  │  ├─ details: { field: "error" }
   │  │  └─ Show field errors
   │  │
   │  ├─ Retry Status (408, 429, 500+)
   │  │  ├─ retryCount < MAX_RETRIES
   │  │  ├─ Wait (1s × 2^retries)
   │  │  └─ Retry request
   │  │
   │  └─ Other Errors
   │     └─ handleApiError()
   │        └─ Format and return
   │
   └─ Return FormattedError
      │
      ├─ message: "User-friendly message"
      ├─ statusCode: number
      ├─ code?: "ERROR_CODE"
      ├─ details?: { validation errors }
      ├─ isNetworkError: boolean
      └─ isValidationError: boolean
```

## Component State Management

```
Page Component
      │
      ├─ Redux State (useAppSelector)
      │  ├─ auth.user
      │  ├─ auth.isAuthenticated
      │  ├─ products.items
      │  └─ products.loading
      │
      ├─ Custom Hook (useAuth, useProducts)
      │  ├─ Redux state
      │  ├─ Dispatch actions
      │  └─ Combined interface
      │
      └─ Redux Dispatch (useAppDispatch)
         ├─ login(credentials)
         ├─ fetchProducts(params)
         ├─ createProduct(data)
         └─ deleteProduct(id)
      
      ▼
Render JSX
      │
      ├─ Display loading states (Loader)
      ├─ Display errors (toast)
      ├─ Display data (items)
      └─ Handle interactions (onClick)
```

## Form Submission Flow

```
User Fills Form
      │
      ▼
Click Submit Button
      │
      ▼
FormWrapper (onSubmit)
      │
      ▼
Yup Validation (validationSchema)
      │
      ├─ Validation Fails
      │  │
      │  └─ Show Field Errors
      │     (FormField displays error)
      │
      └─ Validation Passes
         │
         ▼
         Call onSubmit Handler
         │
         ▼
         Custom Logic
         ├─ Dispatch Redux Action
         ├─ Show Toast
         └─ Redirect
```

## Protected Route Flow

```
User Navigates to /dashboard
      │
      ▼
ProtectedRoute Component
      │
      ├─ Check auth state
      │  (useAppSelector state.auth)
      │
      ├─ isAuthenticated = false
      │  │
      │  └─ Redirect to /login
      │
      ├─ isAuthenticated = true
      │  │
      │  ├─ requiredRole not specified
      │  │  │
      │  │  └─ Render children (Dashboard)
      │  │
      │  └─ requiredRole specified
      │     │
      │     ├─ user.role in requiredRole
      │     │  │
      │     │  └─ Render children
      │     │
      │     └─ user.role not in requiredRole
      │        │
      │        └─ Redirect to /unauthorized
```

## Local Storage Management

```
Authentication Actions
      │
      ├─ Login
      │  │
      │  ├─ localStorage.setItem('auth_token', accessToken)
      │  ├─ localStorage.setItem('refresh_token', refreshToken)
      │  └─ localStorage.setItem('user_data', JSON.stringify(user))
      │
      ├─ Logout / 401 Error
      │  │
      │  ├─ localStorage.removeItem('auth_token')
      │  ├─ localStorage.removeItem('refresh_token')
      │  └─ localStorage.removeItem('user_data')
      │
      └─ App Initialization
         │
         ├─ Read from localStorage
         ├─ Check if token exists
         ├─ Populate Redux state
         └─ Restore session
```

## CRUD Operation Cycle

```
User Action (Create/Edit/Delete)
      │
      ▼
Modal / Form Opens
      │
      ▼
User Enters Data
      │
      ▼
Click Submit
      │
      ▼
Validation Passes
      │
      ▼
Show Loading State
      │
      ▼
Dispatch Redux Action
├─ createProduct(data)
├─ updateProduct(id, data)
└─ deleteProduct(id)
      │
      ▼
Service Method Called
├─ ProductService.createProduct()
├─ ProductService.updateProduct()
└─ ProductService.deleteProduct()
      │
      ▼
API Request
      │
      ├─ Success
      │  │
      │  ├─ Update Redux state
      │  ├─ Show success toast
      │  ├─ Refresh data
      │  └─ Close modal
      │
      └─ Error
         │
         ├─ Handle error
         ├─ Show error toast
         ├─ Keep modal open
         └─ Display validation errors
```

## Retry Logic Flow

```
API Request
      │
      ▼
Response Error with Retry Status
(408, 429, 500, 502, 503, 504)
      │
      ▼
Check retryCount
      │
      ├─ retryCount >= MAX_RETRIES (3)
      │  │
      │  └─ Return Error
      │
      └─ retryCount < MAX_RETRIES
         │
         ├─ Increment retryCount
         │
         ├─ Calculate Delay
         │  └─ delay = BASE_DELAY × 2^(retryCount-1)
         │
         ├─ Wait (setTimeout)
         │  ├─ 1st retry: 1 second
         │  ├─ 2nd retry: 2 seconds
         │  └─ 3rd retry: 4 seconds
         │
         └─ Retry Request
            │
            └─ [Repeat cycle]
```

## Component Hierarchy

```
App
├── Provider (Redux)
│   ├── QueryClientProvider
│   │   └── ThemeProvider
│   │       └── CartProvider
│   │           └── TooltipProvider
│   │               ├── Toaster (Sonner)
│   │               ├── Toaster (UI)
│   │               └── BrowserRouter
│   │                   ├── Routes
│   │                   │   ├── PublicRoute
│   │                   │   ├── ProtectedRoute
│   │                   │   │   ├── Dashboard
│   │                   │   │   └── Admin
│   │                   │   └── 404 NotFound
│   │                   │
│   │                   └── Layout
│   │                       ├── Header
│   │                       ├── Main Content
│   │                       │   ├── LoginPage
│   │                       │   ├── ProductsPage
│   │                       │   └── Others
│   │                       └── Footer
```

These diagrams show the complete flow of data, state management, error handling, and component interactions in the enterprise architecture.
