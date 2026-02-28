export interface Address {
  id: string;
  profile_id: string;
  label: string;
  street: string;
  city: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface AddressPayload {
  label: string;
  street: string;
  city: string;
  country: string;
  is_default?: boolean;
}
