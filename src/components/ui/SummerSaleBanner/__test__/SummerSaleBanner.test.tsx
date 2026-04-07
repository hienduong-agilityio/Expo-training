import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { SummerSaleBanner } from '@app/components/ui/SummerSaleBanner';

// Constants
import { SUMMER_SALE_BANNER } from '@app/mocks/banners';

describe('SummerSaleBanner', () => {
  const baseProps = {
    banner: SUMMER_SALE_BANNER,
    newArrivalsTitle: 'New Arrivals',
    newArrivalsSubtitle: 'Check out the latest',
    actionLabel: 'View All',
    onPressViewAll: jest.fn(),
  };

  it('renders correctly with all props', () => {
    const { toJSON } = render(<SummerSaleBanner {...baseProps} />);

    expect(screen.getByText('New Arrivals')).toBeTruthy();
    expect(screen.getByText('Check out the latest')).toBeTruthy();
    expect(screen.getByText('View All')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onPressViewAll when View All button is pressed', () => {
    const onPressViewAll = jest.fn();
    render(<SummerSaleBanner {...baseProps} onPressViewAll={onPressViewAll} />);

    fireEvent.press(screen.getByText('View All'));

    expect(onPressViewAll).toHaveBeenCalledTimes(1);
  });
});
