import axiosInstance from "../axiosInstance";
import { API_PATHS } from "@/config";

export class PrescriptionService {
  /**
   * Upload a prescription PDF. Demo mode resolves locally if no API base URL.
   */
  static async upload(file: File, note?: string) {
    const form = new FormData();
    form.append("file", file);
    if (note) form.append("note", note);
    const res = await axiosInstance.post(API_PATHS.PRESCRIPTIONS.UPLOAD, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
}