// interfaces/register.interface.ts
export interface RegisterFormState {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  taxId: string;
  region: 'Latam' | 'Norteamérica' | 'Europa' | 'Asia' | 'África' | 'Oceanía';
  country: string;
  userFunction: string;
  customUserFunction: string;
  planType: 'trial' | 'pro';
  planCategory: string;
  planSubcategory: string;
  password?: string;
  deviceUuid: string;
}