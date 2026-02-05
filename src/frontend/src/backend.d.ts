import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface ServiceFilter {
    status?: ServiceStatus;
    serviceType?: BaseServiceType;
    endDate?: Time;
    minQuantity?: bigint;
    startDate?: Time;
}
export interface PartnerSearchResult {
    completedTasks: bigint;
    hourlyRate: bigint;
    pendingEarnings: bigint;
    partnerId: Principal;
    companyName: string;
    rejectedTasks: bigint;
    pendingTasks: bigint;
    skills: Array<string>;
}
export interface Request {
    id: RequestId;
    status: TaskStatus;
    client: Principal;
    title: string;
    createdAt: Time;
    revisionCount: bigint;
    deadline?: Time;
    updatedAt: Time;
    details: string;
    asistenmu: Principal;
    recordStatus: TaskRecordStatus;
}
export interface SubscriptionSummary {
    totalSubscriptions: bigint;
    activeSubscriptions: bigint;
    hasActiveAsistenmu: boolean;
}
export interface RequestInput {
    title: string;
    deadline?: Time;
    subscriptionId: bigint;
    details: string;
}
export interface PartnerSearchCriteria {
    maxHourlyRate?: bigint;
    minHourlyRate?: bigint;
    companyName?: string;
    skills?: string;
}
export type TaskStatus = {
    __kind__: "assignedAsPartner";
    assignedAsPartner: {
        effectiveHours: bigint;
        partnerId: Principal;
        workDeadline?: Time;
        workBriefing: string;
    };
} | {
    __kind__: "rejectedByPartner";
    rejectedByPartner: {
        revisionByPartner: string;
    };
} | {
    __kind__: "revisionRequestedByAsistenmu";
    revisionRequestedByAsistenmu: {
        revisionByAsistenmu: string;
        partnerId: Principal;
    };
} | {
    __kind__: "newlyCreated";
    newlyCreated: null;
} | {
    __kind__: "qaRequestedByPartner";
    qaRequestedByPartner: {
        partnerId: Principal;
    };
} | {
    __kind__: "offerSentToPartner";
    offerSentToPartner: {
        effectiveHours: bigint;
        partnerId: Principal;
        workBriefing: string;
    };
} | {
    __kind__: "completedBYPartnerAndAsistenmu";
    completedBYPartnerAndAsistenmu: {
        finalReport: string;
        partnerId: Principal;
    };
} | {
    __kind__: "inProgressByPartner";
    inProgressByPartner: {
        partnerId: Principal;
    };
};
export interface ServicePage {
    subscriptions: Array<SubscriptionRecord>;
    total: bigint;
    page: bigint;
    pageSize: bigint;
}
export interface PartnerProfile {
    completedTasks: bigint;
    hourlyRate: bigint;
    pendingEarnings: bigint;
    companyName: string;
    rejectedTasks: bigint;
    pendingTasks: bigint;
    skills: Array<string>;
}
export type RequestId = bigint;
export interface UserProfile {
    name: string;
    whatsapp: string;
    email: string;
    company?: string;
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
export enum TaskRecordStatus {
    active = "active",
    completed = "completed",
    qaRequested = "qaRequested",
    rejected = "rejected",
    revisionRequested = "revisionRequested"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptOffer(requestId: RequestId): Promise<Request>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignTaskToPartner(requestId: RequestId, partnerId: Principal, workBriefing: string, effectiveHours: bigint, workDeadline: Time | null): Promise<Request>;
    completeTask(requestId: RequestId, finalReport: string): Promise<Request>;
    createRequest(input: RequestInput): Promise<Request>;
    createSubscription(client: Principal, serviceType: BaseServiceType, quantity: bigint, pricePerService: bigint, startDate: Time, endDate: Time, status: ServiceStatus, asistenmu: Principal | null, sharedPrincipals: Array<Principal>): Promise<SubscriptionRecord>;
    getActiveSubscriptionsForCaller(): Promise<Array<SubscriptionRecord>>;
    getAsistenmuRequests(): Promise<Array<Request>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getClientRequests(): Promise<Array<Request>>;
    getFilteredServices(filter: ServiceFilter, page: bigint): Promise<ServicePage>;
    getPartnerProfile(partner: Principal): Promise<PartnerProfile | null>;
    getPartnerRequests(): Promise<Array<Request>>;
    getRequest(requestId: RequestId): Promise<Request | null>;
    getSubscriptionSummary(): Promise<SubscriptionSummary>;
    getUserIdentities(principals: Array<Principal>): Promise<Array<UserIdentity>>;
    getUserIdentity(principal: Principal): Promise<UserIdentity | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeSystem(adminName: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerAsistenmu(targetPrincipal: Principal, name: string): Promise<void>;
    registerClient(name: string): Promise<void>;
    registerPartner(name: string, companyName: string): Promise<void>;
    rejectOffer(requestId: RequestId, reason: string): Promise<Request>;
    requestQA(requestId: RequestId): Promise<Request>;
    requestRevision(requestId: RequestId, revisionDetails: string): Promise<Request>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePartnerProfile(profile: PartnerProfile): Promise<void>;
    searchPartners(criteria: PartnerSearchCriteria): Promise<Array<PartnerSearchResult>>;
    updateSubscription(id: bigint, client: Principal, serviceType: BaseServiceType, quantity: bigint, pricePerService: bigint, startDate: Time, endDate: Time, status: ServiceStatus, asistenmu: Principal | null, sharedPrincipals: Array<Principal>): Promise<SubscriptionRecord>;
}
