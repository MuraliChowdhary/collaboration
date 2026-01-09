import { Response } from 'express';

/**
 * Standard API Response Interface
 */
export interface ApiResponseData<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Pagination Interface
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * API Response Utility Class
 */
export class ApiResponse {
  static success<T = any>(
    res: Response,
    data: {
      message?: string;
      data?: T;
      pagination?: PaginationMeta;
    },
    statusCode: number = 200
  ): Response {
    const response: ApiResponseData<T> = {
      success: true,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    // ✅ Only assign if defined
    if (data.message !== undefined) {
      response.message = data.message;
    }

    if (data.data !== undefined) {
      response.data = data.data;
    }

    if (data.pagination) {
      response.meta!.pagination = data.pagination;
    }

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: {
      code: string;
      message: string;
      details?: any;
    },
    statusCode: number = 500
  ): Response {
    const response: ApiResponseData = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    return res.status(statusCode).json(response);
  }

  static paginated<T = any>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message?: string
  ): Response {
    return ApiResponse.success(
      res,
      {
        ...(message !== undefined && { message }),
        data,
        pagination,
      },
      200
    );
  }

  static created<T = any>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return ApiResponse.success(
      res,
      {
        message,
        data,
      },
      201
    );
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const pages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    pages,
  };
}
