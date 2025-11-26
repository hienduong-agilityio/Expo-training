import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

// Components
import { AuthTextField } from '@app/components/ui/AuthTextField';

describe('AuthTextField', () => {
  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      placeholder: 'Enter text',
      ...overrides,
    };
    return render(<AuthTextField {...defaultProps} />);
  };

  describe('Rendering', () => {
    it('renders correctly with all props and matches snapshot', () => {
      const { toJSON } = renderComponent({
        label: 'Email',
        error: 'Invalid input',
        leftIcon: <Text>🔒</Text>,
        isPassword: true,
        placeholder: 'Password',
      });

      expect(screen.getByText('Email')).toBeTruthy();
      expect(screen.getByText('Invalid input')).toBeTruthy();
      const input = screen.getByPlaceholderText('Password');
      expect(input.props.secureTextEntry).toBe(true);
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders without optional props', () => {
      renderComponent({
        label: undefined,
        error: undefined,
        leftIcon: undefined,
        isPassword: false,
      });

      expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
      const input = screen.getByPlaceholderText('Enter text');
      expect(input.props.secureTextEntry).toBeFalsy();
    });
  });

  describe('Interactions', () => {
    it('handles text input', () => {
      const onChangeText = jest.fn();
      renderComponent({ onChangeText, placeholder: 'Email' });

      const input = screen.getByPlaceholderText('Email');
      fireEvent.changeText(input, 'test@example.com');

      expect(onChangeText).toHaveBeenCalledWith('test@example.com');
    });
  });
});
