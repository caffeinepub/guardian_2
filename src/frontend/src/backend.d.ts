import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CheckIn {
    latitude: number;
    longitude: number;
    timestamp: bigint;
}
export interface Contact {
    name: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export interface Alert {
    latitude: number;
    longitude: number;
    timestamp: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContact(name: string, phone: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkIn(latitude: number, longitude: number): Promise<void>;
    getAlertHistory(): Promise<Array<Alert>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContacts(): Promise<Array<Contact>>;
    getLocationHistory(): Promise<Array<CheckIn>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeContact(phone: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendSOS(latitude: number, longitude: number): Promise<void>;
}
