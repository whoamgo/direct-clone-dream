export interface MockOrder {
  id: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  address: { line1: string; city: string; state: string; pincode: string; type: string };
  paymentMethod: string;
  createdAt: string;
}

export interface MockPrescription {
  id: string;
  fileName: string;
  status: "pending" | "verified" | "rejected";
  note?: string;
  uploadedAt: string;
}

export const mockOrders: MockOrder[] = [
  {
    id: "DD100001",
    items: [
      { productId: "p1", name: "Dabur Chyawanprakash", price: 320, qty: 2 },
      { productId: "p5", name: "Himalaya Liv.52", price: 195, qty: 1 },
    ],
    total: 835,
    status: "delivered",
    address: { line1: "12 MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001", type: "home" },
    paymentMethod: "UPI",
    createdAt: "2025-04-15T10:30:00Z",
  },
  {
    id: "DD100002",
    items: [
      { productId: "p3", name: "Revital H", price: 499, qty: 1 },
    ],
    total: 499,
    status: "shipped",
    address: { line1: "45 Park Street", city: "Kolkata", state: "West Bengal", pincode: "700016", type: "home" },
    paymentMethod: "Card",
    createdAt: "2025-05-01T14:20:00Z",
  },
  {
    id: "DD100003",
    items: [
      { productId: "p8", name: "MuscleBlaze Whey", price: 2499, qty: 1 },
      { productId: "p12", name: "Ensure Protein", price: 780, qty: 1 },
    ],
    total: 3279,
    status: "confirmed",
    address: { line1: "78 Brigade Road", city: "Bangalore", state: "Karnataka", pincode: "560025", type: "work" },
    paymentMethod: "COD",
    createdAt: "2025-05-10T09:00:00Z",
  },
];

export const mockPrescriptions: MockPrescription[] = [
  {
    id: "rx_001",
    fileName: "prescription_may.pdf",
    status: "verified",
    note: "Need generic alternatives",
    uploadedAt: "2025-05-08T11:00:00Z",
  },
  {
    id: "rx_002",
    fileName: "doctor_note_april.pdf",
    status: "pending",
    uploadedAt: "2025-05-11T15:30:00Z",
  },
];
