import { fireEvent, render, screen } from '@testing-library/react-native';

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

  const renderSizeSelector = (overrides = {}) => {
    return render(<SizeSelector {...mockProps} {...overrides} />);
  };

  it('renders all sizes', () => {
    const { toJSON } = renderSizeSelector();
    expect(screen.getByText('S')).toBeTruthy();
    expect(screen.getByText('M')).toBeTruthy();
    expect(screen.getByText('L')).toBeTruthy();
    expect(screen.getByText('XL')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onSizeSelect when size is pressed', () => {
    renderSizeSelector();

    const sizeButton = screen.getByTestId('size-btn-S');
    fireEvent.press(sizeButton);

    expect(mockProps.onSizeSelect).toHaveBeenCalledWith(
      MOCK_SIZES.find(s => s.size === 'S')?.id,
    );
  });

  it('displays selected size', () => {
    renderSizeSelector({ selectedSize: 'M' });

    expect(screen.getByText(/Size: M/)).toBeTruthy();
  });

  it('displays default text when no size selected', () => {
    renderSizeSelector();

    expect(screen.getByText(/Size: Select size/)).toBeTruthy();
  });

  it('disables unavailable sizes', () => {
    const { toJSON } = renderSizeSelector();

    const unavailableSize = MOCK_SIZES.find(s => !s.available);
    if (unavailableSize) {
      const button = screen.getByTestId(`size-btn-${unavailableSize.size}`);
      // Check accessibilityState for disabled
      expect(button.props.accessibilityState?.disabled).toBe(true);
    }

    expect(toJSON()).toMatchSnapshot();
  });

  it('highlights selected size', () => {
    const { toJSON } = renderSizeSelector({ selectedSize: 'L' });

    expect(toJSON()).toMatchSnapshot();
  });
});
