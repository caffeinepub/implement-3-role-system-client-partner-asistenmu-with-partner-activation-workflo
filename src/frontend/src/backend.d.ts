import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SubscriptionSummary {
    totalSubscriptions: bigint;
    activeSubscriptions: bigint;
    hasActiveAsistenmu: boolean;
}
export type Time = bigint;
export type UserRole = {
    __kind__: "client";
    client: null;
} | {
    __kind__: "admin";
    admin: null;
} | {
    __kind__: "asistenmu";
    asistenmu: null;
} | {
    __kind__: "partner";
    partner: PartnerStatus;
};
export interface UserIdentity {
    principal: Principal;
    name: string;
    role: UserRole;
}
export interface SubscriptionRecord {
    id: bigint;
    status: ServiceStatus;
    client: Principal;
    serviceType: BaseServiceType;
    endDate: Time;
    pricePerService: bigint;
    quantity: bigint;
    asistenmu?: Principal;
    sharedPrincipals: Array<Principal>;
    startDate: Time;
}
export interface ServicePage {
    subscriptions: Array<SubscriptionRecord>;
    total: bigint;
    page: bigint;
    pageSize: bigint;
}
export interface ServiceFilter {
    status?: ServiceStatus;
    serviceType?: BaseServiceType;
    endDate?: Time;
    minQuantity?: bigint;
    startDate?: Time;
}
export interface UserProfile {
    name: string;
}
export enum BaseServiceType {
    fokus = "fokus",
    jaga = "jaga",
    rapi = "rapi",
    tenang = "tenang"
}
export enum PartnerStatus {
    active = "active",
    pending = "pending"
}
export enum ServiceStatus {
    active = "active",
    hold = "hold",
    suspended = "suspended"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createSubscription(client: Principal, serviceType: BaseServiceType, quantity: bigint, pricePerService: bigint, startDate: Time, endDate: Time, status: ServiceStatus, asistenmu: Principal | null, sharedPrincipals: Array<Principal>): Promise<SubscriptionRecord>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getFilteredServices(filter: ServiceFilter, page: bigint): Promise<ServicePage>;
    getSubscriptionSummary(): Promise<SubscriptionSummary>;
    getUserIdentities(principals: Array<Principal>): Promise<Array<UserIdentity>>;
    getUserIdentity(principal: Principal): Promise<UserIdentity | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeSystem(adminName: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerClient(name: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSubscription(id: bigint, client: Principal, serviceType: BaseServiceType, quantity: bigint, pricePerService: bigint, startDate: Time, endDate: Time, status: ServiceStatus, asistenmu: Principal | null, sharedPrincipals: Array<Principal>): Promise<SubscriptionRecord>;
}
