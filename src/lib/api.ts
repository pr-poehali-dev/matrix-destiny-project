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

export const generateReport = async (data: ReportRequest): Promise<ReportResponse> => {
  const response = await fetch(REPORT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate report');
  }

  return response.json();
};

export const downloadPDF = (base64Data: string, filename: string) => {
  const linkSource = `data:application/pdf;base64,${base64Data}`;
  const downloadLink = document.createElement('a');
  downloadLink.href = linkSource;
  downloadLink.download = filename;
  downloadLink.click();
};

export const shareReport = async (data: ReportRequest): Promise<string> => {
  const reportUrl = `${window.location.origin}${window.location.pathname}?share=true&name=${encodeURIComponent(
    data.name
  )}&birth_date=${encodeURIComponent(data.birth_date)}&personal=${data.personal}&destiny=${data.destiny}&social=${
    data.social
  }&spiritual=${data.spiritual}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Моя Матрица Судьбы',
        text: `Расшифровка матрицы судьбы для ${data.name}`,
        url: reportUrl,
      });
      return 'shared';
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  await navigator.clipboard.writeText(reportUrl);
  return 'copied';
};

export interface PaymentSubmitRequest {
  email: string;
  phone?: string;
  screenshot: string;
  filename: string;
  plan_type: string;
  amount: number;
}

export const submitPayment = async (data: PaymentSubmitRequest): Promise<any> => {
  const response = await fetch(PAYMENT_SUBMIT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit payment');
  }

  return response.json();
};