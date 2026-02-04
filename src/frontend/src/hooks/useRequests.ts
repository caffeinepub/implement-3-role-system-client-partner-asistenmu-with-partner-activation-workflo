import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Note: These hooks assume backend methods will be implemented
// The backend currently has the types defined but not the actual CRUD methods

export function useGetClientRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['clientRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return actor.getClientRequests();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetAsistenmuRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['asistenmuRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return actor.getAsistenmuRequests();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      details: string;
      deadline: number | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return actor.createRequest(
        params.title,
        params.details,
        params.deadline ? BigInt(params.deadline) : null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
    },
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      requestId: bigint;
      status: any;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return actor.updateRequestStatus(params.requestId, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
    },
  });
}

export function useRequestRevision() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      requestId: bigint;
      revisionDetails: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return actor.updateRequestStatus(params.requestId, {
        __kind__: 'revisionRequested',
        revisionRequested: { revisionDetails: params.revisionDetails },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
    },
  });
}

export function useCompleteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return actor.updateRequestStatus(requestId, {
        __kind__: 'completed',
        completed: { completionConfirmation: 'Completed by client' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['asistenmuRequests'] });
    },
  });
}
