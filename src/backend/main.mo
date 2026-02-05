import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
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
    #partner  : PartnerStatus;
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

  public type UserProfile = {
    name : Text;
    email : Text;
    whatsapp : Text;
    company : ?Text;
  };

  type PartnerProfile = {
    companyName : Text;
    hourlyRate : Nat;
    skills : [Text];
    pendingTasks : Nat;
    completedTasks : Nat;
    rejectedTasks : Nat;
    pendingEarnings : Nat;
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

  public type SubscriptionRecord = {
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
  public type TaskStatus = {
    #newlyCreated;
    #assignedAsPartner : {
      partnerId : Principal;
      workBriefing : Text;
      effectiveHours : Nat;
      workDeadline : ?Time.Time;
    };
    #offerSentToPartner : {
      partnerId : Principal;
      workBriefing : Text;
      effectiveHours : Nat;
    };
    #rejectedByPartner : {
      revisionByPartner : Text;
    };
    #inProgressByPartner : {
      partnerId : Principal;
    };
    #qaRequestedByPartner : {
      partnerId : Principal;
    };
    #completedBYPartnerAndAsistenmu : {
      partnerId : Principal;
      finalReport : Text;
    };
    #revisionRequestedByAsistenmu : {
      partnerId : Principal;
      revisionByAsistenmu : Text;
    };
  };

  public type TaskRecordStatus = {
    #active;
    #rejected;
    #completed;
    #qaRequested;
    #revisionRequested;
  };

  public type Request = {
    id : RequestId;
    client : Principal;
    asistenmu : Principal;
    title : Text;
    details : Text;
    deadline : ?Time.Time;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    revisionCount : Nat;
    status : TaskStatus;
    recordStatus : TaskRecordStatus;
  };

  type RequestInput = {
    title : Text;
    details : Text;
    deadline : ?Time.Time;
    subscriptionId : Nat;
  };

  public type RequestSummary = {
    pendingRequests : Nat;
    requestsInProgress : Nat;
    completedRequests : Nat;
    revisionRequests : Nat;
  };

  type PartnerSearchCriteria = {
    companyName : ?Text;
    skills : ?Text;
    minHourlyRate : ?Nat;
    maxHourlyRate : ?Nat;
  };

  type PartnerSearchResult = {
    partnerId : Principal;
    companyName : Text;
    hourlyRate : Nat;
    skills : [Text];
    pendingTasks : Nat;
    completedTasks : Nat;
    rejectedTasks : Nat;
    pendingEarnings : Nat;
  };

  var users : Map.Map<Principal, User> = Map.empty<Principal, User>();
  var subscriptions : Map.Map<Nat, SubscriptionRecord> = Map.empty<Nat, SubscriptionRecord>();
  var requests : Map.Map<RequestId, Request> = Map.empty<RequestId, Request>();
  var nextSubscriptionId = 1;
  var nextRequestId = 1;

  var partnerSearchResults : Map.Map<Text, [PartnerSearchResult]> = Map.empty<Text, [PartnerSearchResult]>();
  var taskStatusSearchResults : Map.Map<Text, [TaskStatus]> = Map.empty<Text, [TaskStatus]>();
  var customTaskResults : Map.Map<RequestId, TaskStatus> = Map.empty<RequestId, TaskStatus>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var systemInitialized = false;
  var userProfiles : Map.Map<Principal, UserProfile> = Map.empty<Principal, UserProfile>();
  var partnerProfiles : Map.Map<Principal, PartnerProfile> = Map.empty<Principal, PartnerProfile>();

  // --- Helper Functions ---
  func getUserOrTrap(principal : Principal) : User {
    switch (users.get(principal)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  func isClient(caller : Principal) : Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#client) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isAsistenmu(caller : Principal) : Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#asistenmu) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isPartner(caller : Principal) : Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#partner(_)) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isActivePartner(caller : Principal) : Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#partner(#active)) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isDomainAdmin(caller : Principal) : Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#admin) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isRegistered(caller : Principal) : Bool {
    switch (users.get(caller)) {
      case (?_user) { true };
      case (null) { false };
    };
  };

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
      };
    };
  };

  public shared ({ caller }) func registerPartner(name : Text, companyName : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot register");
    };

    switch (users.get(caller)) {
      case (?existingUser) {
        switch (existingUser.role) {
          case (#partner(_)) { Runtime.trap("Already registered as partner") };
          case (_) { Runtime.trap("Already registered with a different role") };
        };
      };
      case (null) {
        let newUser : User = {
          id = caller;
          name;
          role = #partner(#pending);
          profileComplete = false;
          hasServiceHistory = false;
        };
        users.add(caller, newUser);

        let newProfile : PartnerProfile = {
          companyName;
          hourlyRate = 0;
          skills = [];
          pendingTasks = 0;
          completedTasks = 0;
          rejectedTasks = 0;
          pendingEarnings = 0;
        };
        partnerProfiles.add(caller, newProfile);
      };
    };
  };

  public shared ({ caller }) func registerAsistenmu(targetPrincipal : Principal, name : Text) : async () {
    if (not isDomainAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can register Asistenmu");
    };

    if (targetPrincipal.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot be registered");
    };

    switch (users.get(targetPrincipal)) {
      case (?existingUser) {
        Runtime.trap("Target principal already registered with a role");
      };
      case (null) {
        let newUser : User = {
          id = targetPrincipal;
          name;
          role = #asistenmu;
          profileComplete = false;
          hasServiceHistory = false;
        };
        users.add(targetPrincipal, newUser);
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
    if (not isDomainAdmin(caller)) {
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
    if (not isDomainAdmin(caller)) {
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

  // Returns only the caller's active subscriptions
  public shared ({ caller }) func getActiveSubscriptionsForCaller() : async [SubscriptionRecord] {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous users cannot get subscriptions");
    };
    if (not isClient(caller)) {
      Runtime.trap("Unauthorized: Must be client to view subscriptions");
    };

    let ownedSubscriptions = subscriptions.toArray().filter(
      func(tuple) {
        let (_id, sub) = tuple;
        sub.client == caller;
      }
    );

    let activeSubscriptions = ownedSubscriptions.filter(
      func(tuple) {
        let (_id, sub) = tuple;
        sub.status == #active;
      }
    );

    let mappedSubscriptions = activeSubscriptions.map(
      func(tuple) {
        let (_id, sub) = tuple;
        sub;
      }
    );

    mappedSubscriptions;
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
    if (not isDomainAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view all services");
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
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot view user identities");
    };

    // Any registered user can view identities
    if (not isRegistered(caller)) {
      Runtime.trap("Unauthorized: Caller must be registered");
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
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot view user identities");
    };

    // Any registered user can view identities
    if (not isRegistered(caller)) {
      Runtime.trap("Unauthorized: Caller must be registered");
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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot access profiles");
    };

    // Any registered user can access their own profile
    if (not isRegistered(caller)) {
      Runtime.trap("Unauthorized: Caller must be registered");
    };

    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot access profiles");
    };

    if (caller != user and not isDomainAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin can view any");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot save profiles");
    };

    if (not isClient(caller)) {
      Runtime.trap("Unauthorized: Only clients can save user profiles");
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

  // --- Partner Profile Management ---
  public query ({ caller }) func getPartnerProfile(partner : Principal) : async ?PartnerProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot view partner profiles");
    };

    // Partners can view their own profile, Asistenmu and admins can view any partner profile
    if (caller != partner and not isAsistenmu(caller) and not isDomainAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own partner profile, or be Asistenmu/admin");
    };

    partnerProfiles.get(partner);
  };

  public shared ({ caller }) func savePartnerProfile(profile : PartnerProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot save partner profiles");
    };

    if (not isPartner(caller)) {
      Runtime.trap("Unauthorized: Only partners can save partner profiles");
    };

    partnerProfiles.add(caller, profile);
  };

  // --- Request/Task Management ---

  public shared ({ caller }) func createRequest(input : RequestInput) : async Request {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot create requests");
    };

    if (not isClient(caller)) {
      Runtime.trap("Unauthorized: Only clients can create requests");
    };

    // Validate request title and details
    if (input.title.size() < 3 or input.title.size() > 60) {
      Runtime.trap("Title must be between 3 and 60 characters");
    };

    if (input.details.size() < 10 or input.details.size() > 1024) {
      Runtime.trap("Details must be between 10 and 1024 characters");
    };

    // Validate subscription exists and belongs to the caller
    switch (subscriptions.get(input.subscriptionId)) {
      case (null) { Runtime.trap("Subscription not found") };
      case (?subscription) {
        if (subscription.client != caller) {
          Runtime.trap("Unauthorized: Subscription does not belong to caller");
        };

        if (subscription.status != #active) {
          Runtime.trap("Subscription must be active");
        };

        switch (subscription.asistenmu) {
          case (null) { Runtime.trap("Subscription does not have an assigned asistenmu") };
          case (?asistenmu) {
            // Ensure asistenmu still exists and has correct role
            switch (users.get(asistenmu)) {
              case (null) { Runtime.trap("Invalid asistenmu: User does not exist") };
              case (?user) {
                switch (user.role) {
                  case (#asistenmu) {}; // Valid
                  case (_) { Runtime.trap("Invalid asistenmu: User must have asistenmu role") };
                };
              };
            };

            let id = nextRequestId;
            nextRequestId += 1;

            let now = Time.now();
            let newRequest : Request = {
              id;
              client = caller;
              asistenmu;
              title = input.title;
              details = input.details;
              deadline = input.deadline;
              createdAt = now;
              updatedAt = now;
              revisionCount = 0;
              status = #newlyCreated;
              recordStatus = #active;
            };

            requests.add(id, newRequest);
            newRequest;
          };
        };
      };
    };
  };

  public query ({ caller }) func getRequest(requestId : RequestId) : async ?Request {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot view requests");
    };

    // Caller must be registered
    if (not isRegistered(caller)) {
      Runtime.trap("Unauthorized: Caller must be registered");
    };

    switch (requests.get(requestId)) {
      case (null) { null };
      case (?request) {
        // Client can view their own requests
        // Asistenmu can view requests assigned to them
        // Partners can view requests assigned to them
        // Admins can view all requests
        if (caller == request.client or caller == request.asistenmu or isDomainAdmin(caller)) {
          return ?request;
        };

        // Check if caller is the assigned partner
        switch (request.status) {
          case (#assignedAsPartner(data)) {
            if (caller == data.partnerId) { return ?request };
          };
          case (#offerSentToPartner(data)) {
            if (caller == data.partnerId) { return ?request };
          };
          case (#inProgressByPartner(data)) {
            if (caller == data.partnerId) { return ?request };
          };
          case (#qaRequestedByPartner(data)) {
            if (caller == data.partnerId) { return ?request };
          };
          case (#completedBYPartnerAndAsistenmu(data)) {
            if (caller == data.partnerId) { return ?request };
          };
          case (#revisionRequestedByAsistenmu(data)) {
            if (caller == data.partnerId) { return ?request };
          };
          case (_) {};
        };

        Runtime.trap("Unauthorized: Cannot view this request");
      };
    };
  };

  public query ({ caller }) func getClientRequests() : async [Request] {
    if (not isClient(caller)) {
      Runtime.trap("Unauthorized: Only clients can view their requests");
    };

    requests.toArray().filterMap(
      func(tuple) {
        let (_id, request) = tuple;
        if (request.client == caller) {
          ?request;
        } else {
          null;
        };
      }
    );
  };

  public query ({ caller }) func getAsistenmuRequests() : async [Request] {
    if (not isAsistenmu(caller)) {
      Runtime.trap("Unauthorized: Only Asistenmu can view their assigned requests");
    };

    requests.toArray().filterMap(
      func(tuple) {
        let (_id, request) = tuple;
        if (request.asistenmu == caller) {
          ?request;
        } else {
          null;
        };
      }
    );
  };

  public query ({ caller }) func getPartnerRequests() : async [Request] {
    if (not isPartner(caller)) {
      Runtime.trap("Unauthorized: Only partners can view their assigned requests");
    };

    requests.toArray().filterMap(
      func(tuple) {
        let (_id, request) = tuple;
        switch (request.status) {
          case (#assignedAsPartner(data)) {
            if (data.partnerId == caller) { ?request } else { null };
          };
          case (#offerSentToPartner(data)) {
            if (data.partnerId == caller) { ?request } else { null };
          };
          case (#inProgressByPartner(data)) {
            if (data.partnerId == caller) { ?request } else { null };
          };
          case (#qaRequestedByPartner(data)) {
            if (data.partnerId == caller) { ?request } else { null };
          };
          case (#completedBYPartnerAndAsistenmu(data)) {
            if (data.partnerId == caller) { ?request } else { null };
          };
          case (#revisionRequestedByAsistenmu(data)) {
            if (data.partnerId == caller) { ?request } else { null };
          };
          case (_) { null };
        };
      }
    );
  };

  // --- Partner Search (Asistenmu only) ---
  public query ({ caller }) func searchPartners(criteria : PartnerSearchCriteria) : async [PartnerSearchResult] {
    if (not isAsistenmu(caller) and not isDomainAdmin(caller)) {
      Runtime.trap("Unauthorized: Only Asistenmu and admins can search for partners");
    };

    let allPartners = users.toArray().filterMap(
      func(tuple) {
        let (principal, user) = tuple;
        switch (user.role) {
          case (#partner(#active)) {
            switch (partnerProfiles.get(principal)) {
              case (?profile) {
                // Apply search criteria
                var matches = true;

                switch (criteria.companyName) {
                  case (?name) {
                    if (not profile.companyName.contains(#text name)) {
                      matches := false;
                    };
                  };
                  case (null) {};
                };

                switch (criteria.skills) {
                  case (?skill) {
                    var hasSkill = false;
                    for (s in profile.skills.values()) {
                      if (s.contains(#text skill)) {
                        hasSkill := true;
                      };
                    };
                    if (not hasSkill) {
                      matches := false;
                    };
                  };
                  case (null) {};
                };

                switch (criteria.minHourlyRate) {
                  case (?minRate) {
                    if (profile.hourlyRate < minRate) {
                      matches := false;
                    };
                  };
                  case (null) {};
                };

                switch (criteria.maxHourlyRate) {
                  case (?maxRate) {
                    if (profile.hourlyRate > maxRate) {
                      matches := false;
                    };
                  };
                  case (null) {};
                };

                if (matches) {
                  ?{
                    partnerId = principal;
                    companyName = profile.companyName;
                    hourlyRate = profile.hourlyRate;
                    skills = profile.skills;
                    pendingTasks = profile.pendingTasks;
                    completedTasks = profile.completedTasks;
                    rejectedTasks = profile.rejectedTasks;
                    pendingEarnings = profile.pendingEarnings;
                  };
                } else {
                  null;
                };
              };
              case (null) { null };
            };
          };
          case (_) { null };
        };
      }
    );

    allPartners;
  };

  // --- Task Assignment (Asistenmu only) ---
  public shared ({ caller }) func assignTaskToPartner(
    requestId : RequestId,
    partnerId : Principal,
    workBriefing : Text,
    effectiveHours : Nat,
    workDeadline : ?Time.Time,
  ) : async Request {
    if (not isAsistenmu(caller)) {
      Runtime.trap("Unauthorized: Only Asistenmu can assign tasks to partners");
    };

    if (not isActivePartner(partnerId)) {
      Runtime.trap("Invalid partner: Partner must be active");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        // Verify caller is the assigned asistenmu
        if (request.asistenmu != caller) {
          Runtime.trap("Unauthorized: You are not assigned to this request");
        };

        let updatedRequest : Request = {
          request with
          status = #offerSentToPartner({
            partnerId;
            workBriefing;
            effectiveHours;
          });
          updatedAt = Time.now();
        };

        requests.add(requestId, updatedRequest);
        updatedRequest;
      };
    };
  };

  // --- Partner Accept Offer ---
  public shared ({ caller }) func acceptOffer(requestId : RequestId) : async Request {
    if (not isActivePartner(caller)) {
      Runtime.trap("Unauthorized: Only active partners can accept offers");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        switch (request.status) {
          case (#offerSentToPartner(data)) {
            if (data.partnerId != caller) {
              Runtime.trap("Unauthorized: This offer is not for you");
            };

            let updatedRequest : Request = {
              request with
              status = #inProgressByPartner({ partnerId = caller });
              updatedAt = Time.now();
            };

            requests.add(requestId, updatedRequest);
            updatedRequest;
          };
          case (_) {
            Runtime.trap("Request is not in offer state");
          };
        };
      };
    };
  };

  // --- Partner Reject Offer ---
  public shared ({ caller }) func rejectOffer(requestId : RequestId, reason : Text) : async Request {
    if (not isActivePartner(caller)) {
      Runtime.trap("Unauthorized: Only active partners can reject offers");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        switch (request.status) {
          case (#offerSentToPartner(data)) {
            if (data.partnerId != caller) {
              Runtime.trap("Unauthorized: This offer is not for you");
            };

            let updatedRequest : Request = {
              request with
              status = #rejectedByPartner({ revisionByPartner = reason });
              recordStatus = #rejected;
              updatedAt = Time.now();
            };

            requests.add(requestId, updatedRequest);

            // Increment partner rejection counter
            switch (partnerProfiles.get(caller)) {
              case (?profile) {
                let updatedProfile : PartnerProfile = {
                  profile with
                  rejectedTasks = profile.rejectedTasks + 1;
                };
                partnerProfiles.add(caller, updatedProfile);
              };
              case (null) {};
            };

            updatedRequest;
          };
          case (_) {
            Runtime.trap("Request is not in offer state");
          };
        };
      };
    };
  };

  // --- Partner Request QA ---
  public shared ({ caller }) func requestQA(requestId : RequestId) : async Request {
    if (not isActivePartner(caller)) {
      Runtime.trap("Unauthorized: Only active partners can request QA");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        switch (request.status) {
          case (#inProgressByPartner(data)) {
            if (data.partnerId != caller) {
              Runtime.trap("Unauthorized: You are not assigned to this request");
            };

            let updatedRequest : Request = {
              request with
              status = #qaRequestedByPartner({ partnerId = caller });
              recordStatus = #qaRequested;
              updatedAt = Time.now();
            };

            requests.add(requestId, updatedRequest);
            updatedRequest;
          };
          case (_) {
            Runtime.trap("Request is not in progress state");
          };
        };
      };
    };
  };

  // --- Asistenmu Request Revision ---
  public shared ({ caller }) func requestRevision(requestId : RequestId, revisionDetails : Text) : async Request {
    if (not isAsistenmu(caller)) {
      Runtime.trap("Unauthorized: Only Asistenmu can request revisions");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.asistenmu != caller) {
          Runtime.trap("Unauthorized: You are not assigned to this request");
        };

        switch (request.status) {
          case (#qaRequestedByPartner(data)) {
            let updatedRequest : Request = {
              request with
              status = #revisionRequestedByAsistenmu({
                partnerId = data.partnerId;
                revisionByAsistenmu = revisionDetails;
              });
              recordStatus = #revisionRequested;
              revisionCount = request.revisionCount + 1;
              updatedAt = Time.now();
            };

            requests.add(requestId, updatedRequest);
            updatedRequest;
          };
          case (_) {
            Runtime.trap("Request is not in QA requested state");
          };
        };
      };
    };
  };

  // --- Asistenmu Complete Task ---
  public shared ({ caller }) func completeTask(requestId : RequestId, finalReport : Text) : async Request {
    if (not isAsistenmu(caller)) {
      Runtime.trap("Unauthorized: Only Asistenmu can complete tasks");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.asistenmu != caller) {
          Runtime.trap("Unauthorized: You are not assigned to this request");
        };

        switch (request.status) {
          case (#qaRequestedByPartner(data)) {
            let updatedRequest : Request = {
              request with
              status = #completedBYPartnerAndAsistenmu({
                partnerId = data.partnerId;
                finalReport;
              });
              recordStatus = #completed;
              updatedAt = Time.now();
            };

            requests.add(requestId, updatedRequest);

            // Calculate and add earnings for partner
            switch (partnerProfiles.get(data.partnerId)) {
              case (?profile) {
                // Get effective hours from the original assignment
                var effectiveHours : Nat = 0;
                switch (request.status) {
                  case (#offerSentToPartner(offerData)) {
                    effectiveHours := offerData.effectiveHours;
                  };
                  case (_) {};
                };

                let earnings = effectiveHours * profile.hourlyRate;
                let updatedProfile : PartnerProfile = {
                  profile with
                  completedTasks = profile.completedTasks + 1;
                  pendingEarnings = profile.pendingEarnings + earnings;
                };
                partnerProfiles.add(data.partnerId, updatedProfile);
              };
              case (null) {};
            };

            updatedRequest;
          };
          case (_) {
            Runtime.trap("Request is not in QA requested state");
          };
        };
      };
    };
  };

  // --- Subscription Summary ---
  type SubscriptionSummary = {
    totalSubscriptions : Nat;
    activeSubscriptions : Nat;
    hasActiveAsistenmu : Bool;
  };

  public query ({ caller }) func getSubscriptionSummary() : async SubscriptionSummary {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot get subscription summary");
    };

    if (not isClient(caller)) {
      Runtime.trap("Unauthorized: Only clients can get subscription summary");
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
    label checkLoop while (not hasActiveAsistenmu) {
      switch (arrayIter.next()) {
        case (?tuple) {
          let (_id, subscription) = tuple;
          if (subscription.asistenmu != null) { hasActiveAsistenmu := true };
        };
        case (null) { break checkLoop };
      };
    };

    {
      totalSubscriptions;
      activeSubscriptions = activeSubscriptionsCount;
      hasActiveAsistenmu;
    };
  };
};
