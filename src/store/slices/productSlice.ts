import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductService, Product } from "@/api/services/productService";
import { PaginationParams, PaginatedResponse, ApiState } from "@/types";

export interface ProductState extends ApiState<PaginatedResponse<Product>> {
  items: Product[];
  selectedProduct: Product | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  data: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  },
  filters: {
    page: 1,
    pageSize: 10,
  },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await ProductService.getProducts(params);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue((error as any).message || "Failed to fetch products");
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ProductService.getProduct(id);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue((error as any).message || "Failed to fetch product");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (data: Omit<Product, "id" | "createdAt" | "updatedAt">, { rejectWithValue }) => {
    try {
      const response = await ProductService.createProduct(data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue((error as any).message || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await ProductService.updateProduct(id, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue((error as any).message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await ProductService.deleteProduct(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue((error as any).message || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload?.data || [];
      state.pagination = action.payload?.pagination || initialState.pagination;
      state.success = true;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Fetch Single Product
    builder.addCase(fetchProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
      state.success = true;
    });
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Create Product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload);
      state.success = true;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Update Product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedProduct?.id === action.payload.id) {
        state.selectedProduct = action.payload;
      }
      state.success = true;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Delete Product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.success = true;
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { clearError, setFilters } = productSlice.actions;
export default productSlice.reducer;
