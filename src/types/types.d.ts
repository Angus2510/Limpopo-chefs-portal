export type UserRole = string;
export type UserType = 'student' | 'staff' | 'defaultUserType' | 'guardian';
export type ActionType = 'view' | 'edit' | 'upload';

export interface User {
    id: string;
    userType: string;
    userFirstName: string;
    userLastName: string;
    roles: string[];
    image: string | null;
    needsAgreement: boolean;
    active:boolean;
    inactiveReason:string;
    intakeGroup:string;
  }
  