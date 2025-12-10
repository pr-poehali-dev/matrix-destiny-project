import func2url from '../../backend/func2url.json';

const PAYMENT_URL = func2url.payment;
const SUBSCRIPTION_URL = func2url.subscription;

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

export const createPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  const response = await fetch(PAYMENT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment');
  }

  return response.json();
};

export const checkPaymentStatus = async (paymentId: string): Promise<{ status: string; paid: boolean }> => {
  const response = await fetch(`${PAYMENT_URL}?payment_id=${paymentId}`);

  if (!response.ok) {
    throw new Error('Failed to check payment status');
  }

  return response.json();
};

export const createSubscription = async (data: SubscriptionRequest): Promise<any> => {
  const response = await fetch(SUBSCRIPTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  return response.json();
};

export const checkSubscription = async (email: string): Promise<SubscriptionCheckResponse> => {
  const response = await fetch(`${SUBSCRIPTION_URL}?email=${encodeURIComponent(email)}`);

  if (!response.ok) {
    throw new Error('Failed to check subscription');
  }

  return response.json();
};
