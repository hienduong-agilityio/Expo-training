import { render, fireEvent, screen } from '@testing-library/react-native';
import { PropsWithChildren } from 'react';

import { GlobalHeader } from '@app/components';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: PropsWithChildren) => children,
  useSafeAreaInsets: () => ({ top: 20, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@app/icons', () => ({
  MenuIcon: () => null,
  ProfileIcon: () => null,
  StylishLogo: () => null,
}));

describe('<GlobalHeader />', () => {
  it('renders Menu & Profile buttons by default', () => {
    render(<GlobalHeader />);
    expect(screen.getByLabelText('Menu')).toBeTruthy();
    expect(screen.getByLabelText('Profile')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('triggers handlers when pressed', () => {
    const onMenuPress = jest.fn();
    const onProfilePress = jest.fn();
    render(
      <GlobalHeader
        onMenuPress={onMenuPress}
        onProfilePress={onProfilePress}
      />,
    );

    fireEvent.press(screen.getByLabelText('Menu'));
    fireEvent.press(screen.getByLabelText('Profile'));

    expect(onMenuPress).toHaveBeenCalledTimes(1);
    expect(onProfilePress).toHaveBeenCalledTimes(1);
  });

  it('hides Menu when showMenu=false', () => {
    render(<GlobalHeader showMenu={false} />);
    expect(screen.queryByLabelText('Menu')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('hides Profile when showProfile=false', () => {
    render(<GlobalHeader showProfile={false} />);
    expect(screen.queryByLabelText('Profile')).toBeNull();

    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});
