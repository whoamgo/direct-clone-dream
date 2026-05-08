import { AxiosError } from "axios";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/config";
import { ApiErrorResponse } from "@/types";

export interface FormattedError {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, unknown>;
  isNetworkError: boolean;
  isValidationError: boolean;
}

export const handleApiError = (error: unknown): FormattedError => {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  // Network error
  if (!axiosError.response) {
    if (axiosError.code === "ECONNABORTED") {
      return {
        message: ERROR_MESSAGES.TIMEOUT_ERROR,
        statusCode: 0,
        isNetworkError: true,
        isValidationError: false,
      };
    }

    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: 0,
      isNetworkError: true,
      isValidationError: false,
    };
  }

  const status = axiosError.response.status;
  const data = axiosError.response.data;

  // Validation error (422)
  if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    return {
      message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
      statusCode: status,
      code: data?.code,
      details: data?.details,
      isNetworkError: false,
      isValidationError: true,
    };
  }

  // Specific error messages based on status
  const errorMessages: Record<number, string> = {
    [HTTP_STATUS.BAD_REQUEST]: data?.message || "Bad request. Please check your input.",
    [HTTP_STATUS.UNAUTHORIZED]: ERROR_MESSAGES.UNAUTHORIZED,
    [HTTP_STATUS.FORBIDDEN]: ERROR_MESSAGES.FORBIDDEN,
    [HTTP_STATUS.NOT_FOUND]: ERROR_MESSAGES.NOT_FOUND,
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ERROR_MESSAGES.SERVER_ERROR,
  };

  const message = errorMessages[status] || data?.message || ERROR_MESSAGES.SERVER_ERROR;

  return {
    message,
    statusCode: status,
    code: data?.code,
    details: data?.details,
    isNetworkError: false,
    isValidationError: status === HTTP_STATUS.UNPROCESSABLE_ENTITY,
  };
};

export const getValidationErrorMessage = (
  details?: Record<string, unknown>
): string => {
  if (!details) return ERROR_MESSAGES.VALIDATION_ERROR;

  const messages = Object.entries(details)
    .map(([key, value]) => {
      if (typeof value === "string") return value;
      if (Array.isArray(value)) return value.join(", ");
      return String(value);
    })
    .filter(Boolean);

  return messages.length > 0 ? messages[0] : ERROR_MESSAGES.VALIDATION_ERROR;
};
