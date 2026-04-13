import { PropsWithChildren, ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AllTheProviders = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createNodeMock?: (element: React.ReactElement) => any,
) => render(ui, { wrapper: AllTheProviders, createNodeMock });

/**
 * Use when the tree includes hooks that need React Query (e.g. ProductCard → useWishlist).
 */
export function renderWithQueryClient(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(ui, { ...options, wrapper: Wrapper });
}

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
