import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeActor } from './useSafeActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Request, RequestId, RequestInput, PartnerSearchCriteria, PartnerSearchResult } from '../backend';

export function useGetClientRequests() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery({
    queryKey: ['clientRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getClientRequests();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetAsistenmuRequests() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery({
    queryKey: ['asistenmuRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAsistenmuRequests();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetPartnerRequests() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery({
    queryKey: ['partnerRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPartnerRequests();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateRequest() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RequestInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
    },
  });
}

export function useSearchPartners() {
  const { actor } = useSafeActor();

  return useMutation({
    mutationFn: async (criteria: PartnerSearchCriteria) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchPartners(criteria);
    },
  });
}

export function useAssignTaskToPartner() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      requestId: RequestId;
      partnerId: string;
      workBriefing: string;
      effectiveHours: number;
      workDeadline: number | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.assignTaskToPartner(
        params.requestId,
        Principal.fromText(params.partnerId),
        params.workBriefing,
        BigInt(params.effectiveHours),
        params.workDeadline ? BigInt(params.workDeadline) : null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
      queryClient.invalidateQueries({ queryKey: ['partnerRequests'] });
    },
  });
}

export function useAcceptOffer() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: RequestId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptOffer(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
    },
  });
}

export function useRejectOffer() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { requestId: RequestId; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectOffer(params.requestId, params.reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
      queryClient.invalidateQueries({ queryKey: ['partnerProfile'] });
    },
  });
}

export function useRequestQA() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: RequestId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestQA(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
    },
  });
}

export function useRequestRevision() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { requestId: RequestId; revisionDetails: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestRevision(params.requestId, params.revisionDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
      queryClient.invalidateQueries({ queryKey: ['partnerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
    },
  });
}

export function useCompleteTask() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { requestId: RequestId; finalReport: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeTask(params.requestId, params.finalReport);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
      queryClient.invalidateQueries({ queryKey: ['partnerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['partnerProfile'] });
    },
  });
}

export function useGetPartnerProfile() {
  const { actor, isFetching: actorFetching } = useSafeActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['partnerProfile'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor not available');
      return actor.getPartnerProfile(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}
