import { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react-native';

const AllTheProviders = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createNodeMock?: (element: React.ReactElement) => any,
) => render(ui, { wrapper: AllTheProviders, createNodeMock });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
