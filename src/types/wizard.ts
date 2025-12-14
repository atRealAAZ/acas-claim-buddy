export interface UserDetails {
  name: string;
  address: string;
  email: string;
}

export interface EmployerDetails {
  name: string;
  address: string;
}

export interface WizardData {
  userDetails: UserDetails;
  employerDetails: EmployerDetails;
  discriminationDate?: string; // ISO date string
}

export const initialWizardData: WizardData = {
  userDetails: {
    name: '',
    address: '',
    email: '',
  },
  employerDetails: {
    name: '',
    address: '',
  },
  discriminationDate: undefined,
};
