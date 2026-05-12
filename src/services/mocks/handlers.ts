import { withDelay, mockError, paginate, MOCK_DELAY } from "./mockUtils";
import { mockOrders, mockPrescriptions, MockOrder, MockPrescription } from "./mockData";
import { DEMO } from "@/constants";

// ── Auth ──

export const mockSendOtp = (phone: string) =>
  withDelay({ success: true, data: { phone, requestId: `demo-${Date.now()}` } }, MOCK_DELAY.FAST);

export const mockVerifyOtp = (phone: string, otp: string, name?: string) => {
  if (otp !== DEMO.OTP) {
    return mockError("Invalid OTP. Use 123456 in demo mode.", 401, MOCK_DELAY.FAST);
  }
  return withDelay({
    success: true,
    data: {
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      user: { id: `u_${phone}`, phone, name },
    },
  }, MOCK_DELAY.FAST);
};

// ── Orders ──

export const mockFetchOrders = (page = 1, pageSize = 10) =>
  withDelay({
    success: true,
    data: paginate(mockOrders, page, pageSize),
  }, MOCK_DELAY.NORMAL);

export const mockFetchOrder = (id: string) => {
  const order = mockOrders.find((o) => o.id === id);
  if (!order) return mockError("Order not found", 404, MOCK_DELAY.FAST);
  return withDelay({ success: true, data: order }, MOCK_DELAY.NORMAL);
};

// ── Prescriptions ──

export const mockFetchPrescriptions = () =>
  withDelay({ success: true, data: mockPrescriptions }, MOCK_DELAY.NORMAL);

export const mockUploadPrescription = (fileName: string, note?: string) => {
  const newRx: MockPrescription = {
    id: `rx_${Date.now()}`,
    fileName,
    status: "pending",
    note,
    uploadedAt: new Date().toISOString(),
  };
  mockPrescriptions.push(newRx);
  return withDelay({ success: true, data: newRx }, MOCK_DELAY.SLOW);
};

// ── Cart (server-side, for future API) ──

export const mockSyncCart = (items: { productId: string; qty: number }[]) =>
  withDelay({ success: true, data: { items, syncedAt: new Date().toISOString() } }, MOCK_DELAY.FAST);
