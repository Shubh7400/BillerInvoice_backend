export interface OTPDocument {
  _id: string; // Replace with the actual type of _id if necessary
  otp: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}
