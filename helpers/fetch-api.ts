import { Notification } from "@/components/notification";

interface FetchApiOptions {
  method?: string;
  body?: any;
  defaultSuccessMessage?: string;
  defaultErrorMessage?: string;
}

export const fetchApi = async (
  url: string,
  options: FetchApiOptions = {}
): Promise<any> => {
  const {
    method = "GET",
    body,
    defaultSuccessMessage,
    defaultErrorMessage,
  } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => {
      throw new Error(
        "An error occurred while processing your request. Please try again."
      );
    });

    if (!response.ok) {
      const errorMessage =
        data.error || defaultErrorMessage || "An unexpected error occurred.";
      // Notification.error(errorMessage);
      throw new Error(errorMessage);
    }

    const successMessage =
      data.message ||
      defaultSuccessMessage ||
      "Operation completed successfully.";

    if (
      method === "POST" ||
      method === "DELETE" ||
      url.includes("/api/customers/update")
    ) {
      Notification.success(successMessage);
    }

    return data;
  } catch (error: any) {
    const errorMsg =
      error.message || defaultErrorMessage || "An unexpected error occurred.";
    Notification.error(errorMsg);
    throw error;
  }
};
