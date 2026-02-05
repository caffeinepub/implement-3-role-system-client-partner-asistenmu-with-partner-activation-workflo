import { useInternetIdentity } from './useInternetIdentity';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type backendInterface } from '../backend';
import { createActorWithConfig } from '../config';
import { getSecretParameter } from '../utils/urlParams';

const SAFE_ACTOR_QUERY_KEY = 'safeActor';

export function useSafeActor() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [initError, setInitError] = useState<string | null>(null);

  const actorQuery = useQuery<backendInterface>({
    queryKey: [SAFE_ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;

      if (!isAuthenticated) {
        // Return anonymous actor if not authenticated
        return await createActorWithConfig();
      }

      const actorOptions = {
        agentOptions: {
          identity
        }
      };

      const actor = await createActorWithConfig(actorOptions);
      
      // Try to initialize admin access control, but don't block on failure
      try {
        const adminToken = getSecretParameter('caffeineAdminToken') || '';
        if (adminToken) {
          await actor._initializeAccessControlWithSecret(adminToken);
        }
        setInitError(null);
      } catch (error) {
        // Log but don't throw - allow non-admin users to proceed
        console.warn('Admin initialization failed (expected for non-admin users):', error);
        setInitError(error instanceof Error ? error.message : 'Admin initialization failed');
      }
      
      return actor;
    },
    staleTime: Infinity,
    enabled: true,
    retry: false,
  });

  // When the actor changes, invalidate dependent queries
  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(SAFE_ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
    isLoading: actorQuery.isLoading,
    initError,
  };
}
