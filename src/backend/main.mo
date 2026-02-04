import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // --- Types ---
  type PartnerForm = {
    companyName : Text;
    description : Text;
    contactEmail : Text;
  };

  type PartnerStatus = {
    #pending;
    #active;
  };

  type UserRole = {
    #client;
    #partner : PartnerStatus;
    #asistenmu;
    #admin;
  };

  type User = {
    id : Principal;
    name : Text;
    role : UserRole;
    profileComplete : Bool;
    hasServiceHistory : Bool;
  };

  type UserProfile = {
    name : Text;
  };

  // Summary stats type
  type PartnerStatusCounts = {
    active : Nat;
    pending : Nat;
  };

  type ServiceCounts = {
    total : Nat;
    active : Nat;
    completed : Nat;
  };

  type TaskCounts = {
    total : Nat;
    created : Nat;
    completed : Nat;
  };

  type RequestCounts = {
    total : Nat;
    open : Nat;
    closed : Nat;
  };

  type FinancialOverview = {
    totalRevenue : Nat;
    unpaidAmount : Nat;
    averageTransactionValue : Nat;
    unpaidRequestPercentage : Nat;
  };

  type ServiceGMV = {
    serviceName : Text;
    transactionValue : Nat;
    serviceTransactionPercentage : Nat;
  };

  type GMVReport = {
    totalGMV : Nat;
    services : [ServiceGMV];
  };

  type SummaryStats = {
    totalClients : Nat;
    totalPartners : Nat;
    totalAsistenmu : Nat;
    partnerStatus : PartnerStatusCounts;
    serviceCounts : ServiceCounts;
    asistenmuTasks : TaskCounts;
    requests : RequestCounts;
    financialOverview : FinancialOverview;
    GMV : GMVReport;
  };

  // New types for client search and counts
  type ClientCardCounts = {
    registered : Nat;
    active : Nat;
    passive : Nat;
  };

  type SearchQuery = {
    clientId : ?Text;
    principalId : ?Text;
    name : ?Text;
  };

  type GetClientsResult = {
    clients : [User];
    total : Nat;
  };

  // Service Booking Types
  type BaseServiceType = {
    #tenang;
    #rapi;
    #fokus;
    #jaga;
  };

  type ServiceStatus = {
    #active;
    #hold;
    #suspended;
  };

  type SubscriptionRecord = {
    id : Nat;
    client : Principal;
    serviceType : BaseServiceType;
    quantity : Nat;
    pricePerService : Nat;
    startDate : Time.Time;
    endDate : Time.Time;
    status : ServiceStatus;
    asistenmu : ?Principal;
    sharedPrincipals : [Principal];
  };

  type ServiceFilter = {
    serviceType : ?BaseServiceType;
    startDate : ?Time.Time;
    endDate : ?Time.Time;
    minQuantity : ?Nat;
    status : ?ServiceStatus;
  };

  type ServicePage = {
    subscriptions : [SubscriptionRecord];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };

  type UserIdentity = {
    principal : Principal;
    name : Text;
    role : UserRole;
  };

  public type RequestId = Nat;
  public type RequestStatus = {
    #inProgress;
    #clientReviewPending : { reviewLink : Text };
    #revisionRequested : { revisionDetails : Text };
    #completed : { completionConfirmation : Text };
  };

  public type ServiceRequest = {
    id : RequestId;
    client : Principal;
    asistenmu : Principal;
    title : Text;
    details : Text;
    deadline : ?Time.Time;
    status : RequestStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  var users : Map.Map<Principal, User> = Map.empty<Principal, User>();
  var subscriptions : Map.Map<Nat, SubscriptionRecord> = Map.empty<Nat, SubscriptionRecord>();
  var requests : Map.Map<RequestId, ServiceRequest> = Map.empty<RequestId, ServiceRequest>();
  var nextSubscriptionId = 1;
  var nextRequestId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  var systemInitialized = false;
  var userProfiles : Map.Map<Principal, UserProfile> = Map.empty<Principal, UserProfile>();

  // --- Initialization ---
  public shared ({ caller }) func initializeSystem(adminName : Text) : async () {
    if (systemInitialized) {
      Runtime.trap("Already initialized");
    };
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot initialize");
    };

    let adminUser : User = {
      id = caller;
      name = adminName;
      role = #admin;
      profileComplete = false;
      hasServiceHistory = false;
    };
    users.add(caller, adminUser);
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
    systemInitialized := true;
  };

  // --- User Registration ---
  public shared ({ caller }) func registerClient(name : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot register");
    };

    switch (users.get(caller)) {
      case (?existingUser) {
        switch (existingUser.role) {
          case (#client) { Runtime.trap("Already registered as client") };
          case (_) { Runtime.trap("Already registered with a different role") };
        };
      };
      case (null) {
        let newUser : User = {
          id = caller;
          name;
          role = #client;
          profileComplete = false;
          hasServiceHistory = false;
        };
        users.add(caller, newUser);
        AccessControl.assignRole(accessControlState, caller, caller, #user);
      };
    };
  };

  // --- Service Booking ---

  func validateSubscription(
    client : Principal,
    serviceType : BaseServiceType,
    quantity : Nat,
    pricePerService : Nat,
    startDate : Time.Time,
    endDate : Time.Time,
    asistenmu : ?Principal,
    sharedPrincipals : [Principal],
  ) {
    if (quantity < 20) {
      Runtime.trap("Minimum service quantity is 20");
    };
    if (pricePerService > 999_999_999) {
      Runtime.trap("Price per service cannot exceed 9 digits");
    };
    if (startDate > endDate) {
      Runtime.trap("Start date must be before or equal to end date");
    };

    // Validate client exists and has role #client
    switch (users.get(client)) {
      case (null) { Runtime.trap("Client does not exist") };
      case (?user) {
        switch (user.role) {
          case (#client) {}; // Valid
          case (_) { Runtime.trap("Principal must have role #client") };
        };
      };
    };

    // Validate asistenmu exists and has role #asistenmu
    switch (asistenmu) {
      case (?asisten) {
        switch (users.get(asisten)) {
          case (null) { Runtime.trap("Asistenmu does not exist") };
          case (?user) {
            switch (user.role) {
              case (#asistenmu) {}; // Valid
              case (_) { Runtime.trap("Principal must have role #asistenmu") };
            };
          };
        };
      };
      case (null) {};
    };

    // Validate shared principals count and existence
    let totalShared = sharedPrincipals.size();
    if (totalShared > 6) {
      Runtime.trap("Maximum of 6 shared principals allowed");
    };

    // Validate each shared principal exists
    for (sharedPrincipal in sharedPrincipals.values()) {
      switch (users.get(sharedPrincipal)) {
        case (null) { Runtime.trap("Shared principal does not exist") };
        case (?_user) {}; // Valid
      };
    };
  };

  public shared ({ caller }) func createSubscription(
    client : Principal,
    serviceType : BaseServiceType,
    quantity : Nat,
    pricePerService : Nat,
    startDate : Time.Time,
    endDate : Time.Time,
    status : ServiceStatus,
    asistenmu : ?Principal,
    sharedPrincipals : [Principal],
  ) : async SubscriptionRecord {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create subscriptions");
    };

    validateSubscription(
      client,
      serviceType,
      quantity,
      pricePerService,
      startDate,
      endDate,
      asistenmu,
      sharedPrincipals,
    );

    let id = nextSubscriptionId;
    nextSubscriptionId += 1;

    let newRecord : SubscriptionRecord = {
      id;
      client;
      serviceType;
      quantity;
      pricePerService;
      startDate;
      endDate;
      status;
      asistenmu;
      sharedPrincipals;
    };

    subscriptions.add(id, newRecord);
    newRecord;
  };

  public shared ({ caller }) func updateSubscription(
    id : Nat,
    client : Principal,
    serviceType : BaseServiceType,
    quantity : Nat,
    pricePerService : Nat,
    startDate : Time.Time,
    endDate : Time.Time,
    status : ServiceStatus,
    asistenmu : ?Principal,
    sharedPrincipals : [Principal],
  ) : async SubscriptionRecord {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update subscriptions");
    };

    switch (subscriptions.get(id)) {
      case (null) { Runtime.trap("Subscription not found") };
      case (?_existing) {};
    };

    validateSubscription(
      client,
      serviceType,
      quantity,
      pricePerService,
      startDate,
      endDate,
      asistenmu,
      sharedPrincipals,
    );

    let updatedRecord : SubscriptionRecord = {
      id;
      client;
      serviceType;
      quantity;
      pricePerService;
      startDate;
      endDate;
      status;
      asistenmu;
      sharedPrincipals;
    };

    subscriptions.add(id, updatedRecord);
    updatedRecord;
  };

  func matchesFilter(record : SubscriptionRecord, filter : ServiceFilter) : Bool {
    switch (filter.serviceType) {
      case (?serviceType) {
        if (record.serviceType != serviceType) { return false };
      };
      case (null) {};
    };

    switch (filter.startDate) {
      case (?start) {
        if (record.startDate < start or record.endDate < start) { return false };
      };
      case (null) {};
    };

    switch (filter.endDate) {
      case (?end) {
        if (record.startDate > end or record.endDate > end) { return false };
      };
      case (null) {};
    };

    switch (filter.minQuantity) {
      case (?minQty) {
        if (record.quantity < minQty) { return false };
      };
      case (null) {};
    };

    switch (filter.status) {
      case (?status) {
        if (record.status != status) { return false };
      };
      case (null) {};
    };

    return true;
  };

  // --- Filtering and Pagination for Services ---
  public shared ({ caller }) func getFilteredServices(
    filter : ServiceFilter,
    page : Nat,
  ) : async ServicePage {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view services");
    };

    // Convert subscriptions map to array
    let allSubscriptions = subscriptions.toArray().map(func(tuple) { tuple.1 });

    // Apply filtering
    let filtered = allSubscriptions.filter(func(sub) { matchesFilter(sub, filter) });

    let total = filtered.size();

    // Pagination
    let pageSize = 10;
    let from = page * pageSize;
    let to = Nat.min(from + pageSize, total);

    let paginated = filtered.sliceToArray(from, to);

    {
      subscriptions = paginated;
      total;
      page;
      pageSize;
    };
  };

  // --- User Identity Resolution API ---
  public query ({ caller }) func getUserIdentity(principal : Principal) : async ?UserIdentity {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view user identities");
    };

    switch (users.get(principal)) {
      case (null) { null };
      case (?user) {
        ?{
          principal = user.id;
          name = user.name;
          role = user.role;
        };
      };
    };
  };

  public query ({ caller }) func getUserIdentities(principals : [Principal]) : async [UserIdentity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view user identities");
    };

    // Custom mapFilter logic to avoid non-existent Array.mapFilter
    let iter = principals.values();
    let resultIter = iter.map(func(p) { users.get(p) });
    resultIter.toArray().filterMap(
      func(optUser) {
        switch (optUser) {
          case (?user) {
            ?{
              principal = user.id;
              name = user.name;
              role = user.role;
            };
          };
          case (null) { null };
        };
      }
    );
  };

  // --- Profile and User Management ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot access profiles");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can access profiles");
    };

    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot access profiles");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin can view any");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot save profiles");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can save profiles");
    };

    switch (users.get(caller)) {
      case (?user) {
        let updatedUser : User = {
          user with
          profileComplete = true;
        };
        users.add(caller, updatedUser);
      };
      case (null) { Runtime.trap("User not found") };
    };

    userProfiles.add(caller, profile);
  };

  // --- Helper Function ---
  func getUserOrTrap(principal : Principal) : User {
    switch (users.get(principal)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  // --- Requests ---

  // The rest of the request logic remains unchanged until the following fixes:

  type SubscriptionSummary = {
    totalSubscriptions : Nat;
    activeSubscriptions : Nat;
    hasActiveAsistenmu : Bool;
  };

  public query ({ caller }) func getSubscriptionSummary() : async SubscriptionSummary {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot get subscription summary");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can get subscription summary");
    };

    let clientRecord = getUserOrTrap(caller);
    switch (clientRecord.role) {
      case (#client) {};
      case (_) { Runtime.trap("Only clients can get subscription summary") };
    };

    let clientSubscriptions = subscriptions.toArray().filter(
      func(t) {
        let (_id, sub) = t;
        sub.client == caller;
      }
    );

    let totalSubscriptions = clientSubscriptions.size();

    let activeSubscriptions = clientSubscriptions.filter(
      func(t) {
        let (_id, sub) = t;
        sub.status == #active;
      }
    );

    let activeSubscriptionsCount = activeSubscriptions.size();

    // Use a loop to check if any subscription has an active asistenmu
    var hasActiveAsistenmu = false;
    let arrayIter = activeSubscriptions.values();
    while (not hasActiveAsistenmu) {
      switch (arrayIter.next()) {
        case (?tuple) {
          let (_id, subscription) = tuple;
          if (subscription.asistenmu != null) { hasActiveAsistenmu := true };
        };
        case (null) { hasActiveAsistenmu := false };
      };
    };

    {
      totalSubscriptions;
      activeSubscriptions = activeSubscriptionsCount;
      hasActiveAsistenmu;
    };
  };
};
