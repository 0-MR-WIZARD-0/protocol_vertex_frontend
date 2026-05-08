export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface SuccessResponse {
  success: boolean;
}