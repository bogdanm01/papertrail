export interface AuthUser {
  email: string;
  name: string | null;
  profilePicture?: string | null;
  onboardingStep: number;
}
