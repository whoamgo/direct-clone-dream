import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/common/Button";
import { Loader } from "@/components/common/Loader";
import { Modal } from "@/components/common/Modal";
import { FormWrapper } from "@/components/common/FormWrapper";
import { FormField } from "@/components/common/FormField";
import { validationSchemas } from "@/utils/validationSchemas";
import { toast } from "sonner";
import { Trash2, CreditCard as Edit2, Plus } from "lucide-react";

export const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const {
    items,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  useEffect(() => {
    fetchProducts({
      page,
      pageSize: 10,
    });
  }, [page]);

  const handleSubmit = async (data: any) => {
    try {
      if (editingId) {
        await updateProduct(editingId, data);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(data);
        toast.success("Product created successfully!");
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchProducts({ page, pageSize: 10 });
    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully!");
        fetchProducts({ page, pageSize: 10 });
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <Plus size={20} /> Add Product
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-blue-600">
                ${product.price}
              </span>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded">
                {product.category}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(product.id)}
                variant="outline"
                size="sm"
                fullWidth
              >
                <Edit2 size={16} /> Edit
              </Button>
              <Button
                onClick={() => handleDelete(product.id)}
                variant="danger"
                size="sm"
                fullWidth
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="px-4 py-2 font-medium">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page === pagination.totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
        title={editingId ? "Edit Product" : "Add Product"}
        size="lg"
      >
        <FormWrapper
          onSubmit={handleSubmit}
          validationSchema={validationSchemas.product}
          className="space-y-4"
        >
          <FormField
            name="name"
            label="Product Name"
            placeholder="Enter product name"
            required
          />

          <FormField
            name="description"
            label="Description"
            placeholder="Enter product description"
            as="textarea"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="price"
              label="Price"
              type="number"
              placeholder="0.00"
              step="0.01"
              required
            />

            <FormField
              name="category"
              label="Category"
              placeholder="Enter category"
              required
            />
          </div>

          <FormField
            name="image"
            label="Image URL"
            type="url"
            placeholder="https://example.com/image.jpg"
            required
          />

          <div className="flex gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </FormWrapper>
      </Modal>
    </div>
  );
};
