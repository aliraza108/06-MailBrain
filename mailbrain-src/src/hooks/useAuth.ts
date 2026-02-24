import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

export function useAuth() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("mailbrain_token") : null;

  const query = useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: api.auth.me,
    enabled: Boolean(token),
    retry: 1,
  });

  return {
    token,
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    logout: api.auth.logout,
  };
}
