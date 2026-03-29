import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Alert, CheckIn, Contact, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetContacts() {
  const { actor, isFetching } = useActor();
  return useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, phone }: { name: string; phone: string }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.addContact(name, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useRemoveContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (phone: string) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.removeContact(phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useSendSOS() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      latitude,
      longitude,
    }: { latitude: number; longitude: number }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.sendSOS(latitude, longitude);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alertHistory"] });
    },
  });
}

export function useGetAlertHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<Alert[]>({
    queryKey: ["alertHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlertHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCheckIn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      latitude,
      longitude,
    }: { latitude: number; longitude: number }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.checkIn(latitude, longitude);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locationHistory"] });
    },
  });
}

export function useGetLocationHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<CheckIn[]>({
    queryKey: ["locationHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLocationHistory();
    },
    enabled: !!actor && !isFetching,
  });
}
