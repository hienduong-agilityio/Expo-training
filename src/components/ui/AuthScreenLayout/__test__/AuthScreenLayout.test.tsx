import { render, screen } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Component
import { AuthScreenLayout } from '@app/components/ui/AuthScreenLayout';

describe('<AuthScreenLayout />', () => {
  it('renders title and children', () => {
    const { toJSON } = render(
      <AuthScreenLayout title="Welcome">
        <View>
          <Text>Child A</Text>
        </View>
        <View>
          <Text>Child B</Text>
        </View>
      </AuthScreenLayout>,
    );

    expect(screen.getByText('Welcome')).toBeTruthy();
    expect(screen.getByText('Child A')).toBeTruthy();
    expect(screen.getByText('Child B')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });
});
