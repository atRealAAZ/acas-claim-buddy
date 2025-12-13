export interface UserDetails {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  email: string;
}

export interface EmployerDetails {
  legalName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
}

export interface WizardData {
  userDetails: UserDetails;
  employerDetails: EmployerDetails;
}

export const initialWizardData: WizardData = {
  userDetails: {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    email: '',
  },
  employerDetails: {
    legalName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
  },
};
