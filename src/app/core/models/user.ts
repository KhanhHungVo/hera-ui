import { Resource } from './resource';

export class User extends Resource{
    userName: string;
    email: string;
    password?: string;
    firstName? : string;
    lastName? : string;
    profilePicture? : string;
    phoneNumber? : string;
    dateOfBirth?: string;
    token? : string;
    providerTokenId? : string;
}