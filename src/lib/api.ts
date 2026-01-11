import func2url from '../../backend/func2url.json';

const ADMIN_REQUESTS_URL = func2url['admin-requests'];
const PAYMENT_SUBMIT_URL = func2url['payment-submit'];
const ADMIN_APPROVE_URL = func2url['admin-approve'];
const ACCESS_CHECK_URL = func2url['access-check'];
const REPORT_URL = func2url.report;

export interface PaymentRequest {
  subscription_type: 'single' | 'month' | 'half_year' | 'year';
  email: string;
  name: string;
  return_url: string;
}

export interface PaymentResponse {
  payment_id: string;
  confirmation_url: string;
  status: string;
}

export interface SubscriptionRequest {
  email: string;
  name: string;
  subscription_type: string;
  payment_id: string;
  amount: number;
}

export interface SubscriptionCheckResponse {
  has_access: boolean;
  subscription_type?: string;
  status?: string;
  end_date?: string;
}

export const checkAccess = async (email: string): Promise<SubscriptionCheckResponse> => {
  const response = await fetch(`${ACCESS_CHECK_URL}?email=${encodeURIComponent(email)}`);

  if (!response.ok) {
    throw new Error('Failed to check access');
  }

  const data = await response.json();
  return data;
};

export const createPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  throw new Error('Payment function removed - use manual payment via QR code');
};

export const checkPaymentStatus = async (paymentId: string): Promise<{ status: string; paid: boolean }> => {
  throw new Error('Payment status check removed - use manual payment via QR code');
};

export const createSubscription = async (data: SubscriptionRequest): Promise<any> => {
  throw new Error('Subscription creation removed - use manual payment via QR code');
};

export const checkSubscription = async (email: string): Promise<SubscriptionCheckResponse> => {
  return checkAccess(email);
};

export interface ReportRequest {
  name: string;
  birth_date: string;
  personal: number;
  destiny: number;
  social: number;
  spiritual: number;
}

export interface ReportResponse {
  pdf: string;
  filename: string;
}



export interface PaymentSubmitRequest {
  email: string;
  phone?: string;
  screenshot: string;
  filename: string;
  plan_type: string;
  amount: number;
}

export const submitPayment = async (data: PaymentSubmitRequest): Promise<any> => {
  if (!PAYMENT_SUBMIT_URL) {
    console.error('PAYMENT_SUBMIT_URL is not defined. func2url:', func2url);
    throw new Error('Сервис временно недоступен. Обновите страницу (Ctrl+F5) и попробуйте снова');
  }

  console.log('Submitting payment to:', PAYMENT_SUBMIT_URL);
  
  try {
    const response = await fetch(PAYMENT_SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to submit payment';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: any) {
    console.error('submitPayment error:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Не удалось подключиться к серверу. Обновите страницу (Ctrl+F5) и попробуйте снова');
    }
    throw new Error(error.message || 'Не удалось отправить заявку. Проверьте интернет-соединение');
  }
};