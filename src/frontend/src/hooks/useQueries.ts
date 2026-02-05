import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeActor } from './useSafeActor';
import { UserProfile, UserRole__1, ServiceFilter, UserIdentity, SubscriptionRecord, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';
import { useInternetIdentity } from './useInternetIdentity';

// Get caller's user profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Save caller's user profile
export function useSaveCallerUserProfile() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      queryClient.invalidateQueries({ queryKey: ['domainRole'] });
    },
  });
}

// Register as client
export function useRegisterClient() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerClient(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['domainRole'] });
    },
  });
}

// Get user role - AccessControl role (for legacy compatibility)
export function useGetUserRole() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery<UserRole__1>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Get domain role - the actual user role from backend (client/partner/asistenmu/admin)
export function useGetDomainRole() {
  const { actor, isFetching: actorFetching } = useSafeActor();
  const { identity } = useInternetIdentity();

  return useQuery<string | null>({
    queryKey: ['domainRole'],
    queryFn: async () => {
      if (!actor || !identity) return null;
      
      try {
        // Get the caller's identity using their Principal from Internet Identity
        const callerPrincipal = identity.getPrincipal();
        const userIdentity = await actor.getUserIdentity(callerPrincipal);
        
        if (!userIdentity) return null;
        
        // Extract domain role from UserRole variant
        const role = userIdentity.role;
        if ('__kind__' in role) {
          switch (role.__kind__) {
            case 'admin':
              return 'admin';
            case 'client':
              return 'client';
            case 'asistenmu':
              return 'asistenmu';
            case 'partner':
              return 'partner';
            default:
              return null;
          }
        }
        return null;
      } catch (error) {
        console.error('Error fetching domain role:', error);
        throw error; // Propagate error to React Query error state
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 1,
    retryDelay: 1000,
  });
}

// Get filtered services with pagination (admin only)
export function useGetFilteredServices(filter: ServiceFilter, page: number) {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery({
    queryKey: ['subscriptions', filter, page],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFilteredServices(filter, BigInt(page));
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Create subscription (admin only)
export function useCreateSubscription() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      client: Principal;
      serviceType: any;
      quantity: bigint;
      pricePerService: bigint;
      startDate: bigint;
      endDate: bigint;
      status: any;
      asistenmu: Principal | null;
      sharedPrincipals: Principal[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSubscription(
        params.client,
        params.serviceType,
        params.quantity,
        params.pricePerService,
        params.startDate,
        params.endDate,
        params.status,
        params.asistenmu,
        params.sharedPrincipals
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptions'] });
    },
  });
}

// Update subscription (admin only)
export function useUpdateSubscription() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      client: Principal;
      serviceType: any;
      quantity: bigint;
      pricePerService: bigint;
      startDate: bigint;
      endDate: bigint;
      status: any;
      asistenmu: Principal | null;
      sharedPrincipals: Principal[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSubscription(
        params.id,
        params.client,
        params.serviceType,
        params.quantity,
        params.pricePerService,
        params.startDate,
        params.endDate,
        params.status,
        params.asistenmu,
        params.sharedPrincipals
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptions'] });
    },
  });
}

// Get user identity by principal (for validation)
export function useGetUserIdentity(principalText: string) {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery<UserIdentity | null>({
    queryKey: ['userIdentity', principalText],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!principalText) return null;
      
      try {
        const principal = Principal.fromText(principalText);
        return actor.getUserIdentity(principal);
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!principalText,
    retry: false,
  });
}

// Get multiple user identities (for shared principals)
export function useGetUserIdentities(principalTexts: string[]) {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery<UserIdentity[]>({
    queryKey: ['userIdentities', principalTexts],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (principalTexts.length === 0) return [];
      
      try {
        const principals = principalTexts.map(p => Principal.fromText(p));
        return actor.getUserIdentities(principals);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && principalTexts.length > 0,
    retry: false,
  });
}

// Get subscription summary for client
export function useGetSubscriptionSummary() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery({
    queryKey: ['subscriptionSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSubscriptionSummary();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Get active subscriptions for caller (client only)
export function useGetActiveSubscriptionsForCaller() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery<SubscriptionRecord[]>({
    queryKey: ['activeSubscriptions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getActiveSubscriptionsForCaller();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
