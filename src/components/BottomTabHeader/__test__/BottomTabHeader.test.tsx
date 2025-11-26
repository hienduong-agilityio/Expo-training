import { fireEvent, render, screen } from '@testing-library/react-native';
import { PropsWithChildren } from 'react';
import { ParamListBase } from '@react-navigation/native';

// Components
import { BottomTabHeader } from '@app/components/BottomTabHeader';

// Constants
import { PRIVATE_SCREENS } from '@app/constants';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: PropsWithChildren) => children,
  useSafeAreaInsets: () => ({ top: 20, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@app/icons', () => ({
  MenuIcon: () => null,
  ProfileIcon: () => null,
  StylishLogo: () => null,
}));

describe('BottomTabHeader', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as BottomTabNavigationProp<ParamListBase, string>;

  const renderComponent = () => {
    return render(
      <BottomTabHeader
        navigation={mockNavigation}
        layout={{ width: 100, height: 100 }}
        options={{ headerShown: false }}
        route={{ key: 'Home', name: 'Home', path: 'Home' }}
      />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { toJSON } = renderComponent();

    expect(toJSON()).toMatchSnapshot();
  });

  it('navigates to settings when profile is pressed', () => {
    renderComponent();

    const profileButton = screen.getByLabelText('Profile');
    fireEvent.press(profileButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      PRIVATE_SCREENS.SETTINGS,
    );
  });
});
