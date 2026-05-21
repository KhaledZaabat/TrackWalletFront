export interface PasswordForm {
  password: string;
  confirmPassword: string;
}

export interface RegisterFormModel {
  fullName: string;
  email: string;
  username: string;

  passwordForm: PasswordForm;

  isMale: boolean;

  birthDate: string;

  profileImage: File | null;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  userName: string;
  password: string;

  isMale: boolean;

  birthDate: string;

  profileImage: File | null;
}

export function toRegisterRequest(model: RegisterFormModel): RegisterRequest {
  return {
    fullName:     model.fullName,
    email:        model.email,
    userName:     model.username,
    password:     model.passwordForm.password,
    isMale:       model.isMale,
    birthDate:    model.birthDate,
    profileImage: model.profileImage,
  };
}
