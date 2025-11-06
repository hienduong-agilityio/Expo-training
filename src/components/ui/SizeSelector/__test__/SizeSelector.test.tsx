import { render, screen } from '@testing-library/react-native';

// Components
import { SizeSelector } from '@app/components/ui/SizeSelector';

// Mocks
import { MOCK_SIZES } from '@app/mocks/products';

describe('SizeSelector', () => {
  const mockProps = {
    sizes: [...MOCK_SIZES],
    onSizeSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderSizeSelector = (props: typeof mockProps) => {
    return render(<SizeSelector {...props} />);
  };

  it('renders all sizes', () => {
    renderSizeSelector(mockProps);
    expect(screen.getByText('S')).toBeTruthy();
    expect(screen.getByText('M')).toBeTruthy();
    expect(screen.getByText('L')).toBeTruthy();
    expect(screen.getByText('XL')).toBeTruthy();

    const { toJSON } = renderSizeSelector(mockProps);
    expect(toJSON()).toMatchSnapshot();
  });
});
