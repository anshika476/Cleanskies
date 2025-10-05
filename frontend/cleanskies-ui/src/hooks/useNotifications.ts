import { useQuery, useQueryClient } from "@tanstack/react-query";

export type Notification = {
  id: string;
  title: string;
  time?: string;
  type?: "info" | "warning" | "critical";
};

const CLEARED_KEY = "cleanskies.clearedNotifications";

async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch("/mock_notifications.json");
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
}

export function useNotifications() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  function clearAll() {
    // store cleared IDs in localStorage so the mock UI hides them
  const ids = (query.data as Notification[] | undefined)?.map((n) => n.id) ?? [];
    try {
      localStorage.setItem(CLEARED_KEY, JSON.stringify(ids));
    } catch (e) {
      // ignore
    }
  qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  function getVisible() {
    const cleared = (() => {
      try {
        const raw = localStorage.getItem(CLEARED_KEY);
        return raw ? (JSON.parse(raw) as string[]) : [];
      } catch (e) {
        return [] as string[];
      }
    })();

  return ((query.data as Notification[] | undefined) ?? []).filter((n) => !cleared.includes(n.id));
  }

  return {
    ...query,
    clearAll,
    visible: getVisible(),
  } as const;
}
