export interface PaymentMethod {
  id: string;
  profile_id: string;
  provider: string;
  token: string;
  last4: string;
  is_default: boolean;
  created_at: string;
}

export interface PaymentPayload {
  provider: string;
  token: string;
  last4: string;
  is_default?: boolean;
}
