import { useEffect, useRef, useState } from 'react';
import { apiBaseURL } from '@/api/axiosInstance';
import type { OrderStatus, StatusEvent } from '@/types';

interface UseOrderSSEArgs {
  orderId: string | undefined;
  initialStatus: OrderStatus | undefined;
  initialHistory: StatusEvent[] | undefined;
}

interface UseOrderSSEResult {
  status: OrderStatus | undefined;
  history: StatusEvent[];
  connected: boolean;
}

export const useOrderSSE = ({
  orderId,
  initialStatus,
  initialHistory,
}: UseOrderSSEArgs): UseOrderSSEResult => {
  const [status, setStatus] = useState<OrderStatus | undefined>(initialStatus);
  const [history, setHistory] = useState<StatusEvent[]>(initialHistory ?? []);
  const [connected, setConnected] = useState(false);

  const seenStatuses = useRef<Set<OrderStatus>>(new Set());

  useEffect(() => {
    if (initialStatus) setStatus(initialStatus);
    if (initialHistory && initialHistory.length > 0) {
      setHistory(initialHistory);
      seenStatuses.current = new Set(initialHistory.map((h) => h.status));
    }
  }, [initialStatus, initialHistory]);

  useEffect(() => {
    if (!orderId) return;
    if (status === 'delivered') return;

    const url = `${apiBaseURL()}/api/orders/${orderId}/stream`;
    const source = new EventSource(url);

    source.onopen = () => setConnected(true);

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as {
          id: string;
          status: OrderStatus;
          at?: string;
        };
        setStatus(parsed.status);
        if (!seenStatuses.current.has(parsed.status)) {
          seenStatuses.current.add(parsed.status);
          setHistory((prev) => [
            ...prev,
            { status: parsed.status, at: parsed.at ?? new Date().toISOString() },
          ]);
        }
        if (parsed.status === 'delivered') {
          source.close();
          setConnected(false);
        }
      } catch {
        // ignore malformed payloads
      }
    };

    source.onerror = () => {
      setConnected(false);
      source.close();
    };

    return () => {
      source.close();
      setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return { status, history, connected };
};
