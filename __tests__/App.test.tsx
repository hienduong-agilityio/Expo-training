/**
 * @format
 */

jest.mock('../app/_layout', () => ({
  __esModule: true,
  default: function MockRootLayout() {
    return null;
  },
}));

import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
