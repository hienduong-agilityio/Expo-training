import { render, screen } from '@testing-library/react-native';

// Components
import { DeliveryInfo } from '@app/components/ui/DeliveryInfo';

describe('DeliveryInfo', () => {
  const renderDeliveryInfo = (overrides = {}) => {
    return render(<DeliveryInfo {...overrides} />);
  };

  describe('Snapshots', () => {
    it('matches snapshot for default delivery time', () => {
      const { toJSON } = renderDeliveryInfo();

      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('renders with default delivery time', () => {
    renderDeliveryInfo();

    expect(screen.getByText('Delivery in')).toBeTruthy();
    expect(screen.getByText('1 within Hour')).toBeTruthy();
  });

  it('renders with custom delivery time', () => {
    renderDeliveryInfo({ deliveryTime: '2-3 days' });

    expect(screen.getByText('Delivery in')).toBeTruthy();
    expect(screen.getByText('2-3 days')).toBeTruthy();
  });

  it('renders with same day delivery', () => {
    renderDeliveryInfo({ deliveryTime: 'Same Day' });

    expect(screen.getByText('Delivery in')).toBeTruthy();
    expect(screen.getByText('Same Day')).toBeTruthy();
  });
});
