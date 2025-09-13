import { z } from 'zod';
import { UserType } from '@prisma/client';

export const UserCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  userType: z.nativeEnum(UserType).default(UserType.GUEST),
  profileImageUrl: z.string().url().optional(),
  organizationName: z.string().min(2).max(200).optional(),
  phone: z.string().optional(),
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

export const UserUpdateSchema = UserCreateSchema.partial().extend({
  id: z.string(),
});

export const UserProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  profileImageUrl: z.string().url().optional(),
  phone: z.string().optional(),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

export const UserRoleChangeSchema = z.object({
  id: z.string(),
  userType: z.nativeEnum(UserType),
  organizationName: z.string().optional(),
});

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserRoleChange = z.infer<typeof UserRoleChangeSchema>;

export class UserModel {
  static validateCreate(data: unknown) {
    return UserCreateSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return UserUpdateSchema.parse(data);
  }

  static validateProfile(data: unknown) {
    return UserProfileSchema.parse(data);
  }

  static validateRoleChange(data: unknown) {
    const validated = UserRoleChangeSchema.parse(data);
    
    // Require organization name for governing bodies
    if (validated.userType === UserType.GOVERNING_BODY && !validated.organizationName) {
      throw new Error('Organization name is required for governing body users');
    }
    
    return validated;
  }

  static canCreateProperty(userType: UserType): boolean {
    return [UserType.PROPERTY_OWNER, UserType.ADMIN].includes(userType);
  }

  static canManageReserves(userType: UserType): boolean {
    return [UserType.GOVERNING_BODY, UserType.ADMIN].includes(userType);
  }

  static canModerateReviews(userType: UserType): boolean {
    return userType === UserType.ADMIN;
  }

  static canVerifyReserves(userType: UserType): boolean {
    return [UserType.GOVERNING_BODY, UserType.ADMIN].includes(userType);
  }

  static canAccessAdminPanel(userType: UserType): boolean {
    return userType === UserType.ADMIN;
  }

  static generateDisplayName(user: { name?: string | null; email: string }): string {
    if (user.name) {
      return user.name;
    }
    
    // Extract name from email
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  static maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    
    const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
    return `${maskedName}@${domain}`;
  }

  static validatePermission(userType: UserType, requiredPermission: string): boolean {
    const permissions = {
      [UserType.GUEST]: ['create_review', 'update_own_review', 'delete_own_review'],
      [UserType.PROPERTY_OWNER]: ['create_review', 'update_own_review', 'delete_own_review', 'create_property', 'update_own_property', 'view_property_analytics'],
      [UserType.GOVERNING_BODY]: ['create_review', 'update_own_review', 'delete_own_review', 'verify_reserves', 'manage_own_reserves', 'respond_to_reviews'],
      [UserType.ADMIN]: ['*'], // All permissions
    };

    const userPermissions = permissions[userType] || [];
    return userPermissions.includes('*') || userPermissions.includes(requiredPermission);
  }
}