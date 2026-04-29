import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Stub framer-motion to skip animations and avoid AnimatePresence quirks in jsdom.
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const passthrough = (Tag: keyof JSX.IntrinsicElements) =>
    React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) => {
      const {
        initial: _initial,
        animate: _animate,
        exit: _exit,
        transition: _transition,
        whileHover: _wh,
        whileTap: _wt,
        ...rest
      } = props as Record<string, unknown>;
      return React.createElement(
        Tag as string,
        { ref, ...(rest as Record<string, unknown>) },
        (rest as { children?: React.ReactNode }).children,
      );
    });

  return {
    motion: new Proxy(
      {},
      {
        get: (_t, prop: string) => passthrough(prop as keyof JSX.IntrinsicElements),
      },
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;
  closed = false;
  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }
  emit(data: unknown): void {
    this.onmessage?.({ data: JSON.stringify(data) } as MessageEvent);
  }
  close(): void {
    this.closed = true;
  }
}

(globalThis as unknown as { EventSource: typeof MockEventSource }).EventSource =
  MockEventSource;
(globalThis as unknown as { MockEventSource: typeof MockEventSource }).MockEventSource =
  MockEventSource;
