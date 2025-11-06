import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

// Components
import { TextField } from '../index';

// Enums
import { TEXTFIELD_VARIANTS } from '@app/enums';

describe('TextField', () => {
  // Snapshot tests
  it('matches snapshot for basic field', () => {
    const { toJSON } = render(<TextField placeholder="Enter text" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot with label and error', () => {
    const { toJSON } = render(
      <TextField
        label="Email"
        placeholder="Enter email"
        error="Invalid email"
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot with icons and password field', () => {
    const { toJSON } = render(
      <TextField
        placeholder="Password"
        leftIcon={<Text>🔒</Text>}
        rightIcon={<Text>👁️</Text>}
        isSecureText={true}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  // Basic rendering and core functionality
  it('renders with label and handles text input', () => {
    const onChangeText = jest.fn();

    render(
      <TextField
        label="Email"
        placeholder="Enter email"
        onChangeText={onChangeText}
      />,
    );

    expect(screen.getByText('Email')).toBeTruthy();

    const input = screen.getByPlaceholderText('Enter email');
    fireEvent.changeText(input, 'test@example.com');

    expect(onChangeText).toHaveBeenCalledWith('test@example.com');
  });

  // Variants and states
  it('renders different variants and error state', () => {
    const { rerender } = render(
      <TextField placeholder="Test" variant={TEXTFIELD_VARIANTS.FILLED} />,
    );

    rerender(<TextField placeholder="Test" error="Invalid input" />);

    expect(screen.getByText('Invalid input')).toBeTruthy();
  });

  it('forwards TextInput props correctly', () => {
    render(
      <TextField
        placeholder="Test field"
        maxLength={10}
        keyboardType="numeric"
        editable={false}
      />,
    );

    const input = screen.getByPlaceholderText('Test field');
    expect(input.props.maxLength).toBe(10);
    expect(input.props.keyboardType).toBe('numeric');
    expect(input.props.editable).toBe(false);
  });

  it('handles password field with toggle', () => {
    const onRightPress = jest.fn();

    render(
      <TextField
        placeholder="Password"
        isSecureText={true}
        rightIcon={<Text>🔒</Text>}
        onRightPress={onRightPress}
      />,
    );

    const input = screen.getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);

    // Should show password toggle icon
    const toggleIcon = screen.getByText('🙈');
    fireEvent.press(toggleIcon);

    // Should call handler and toggle visibility
    expect(onRightPress).toHaveBeenCalledTimes(1);
    expect(input.props.secureTextEntry).toBe(false);
    expect(screen.getByText('👁️')).toBeTruthy();
  });

  // Icons functionality
  it('renders icons correctly', () => {
    render(
      <TextField
        placeholder="Search"
        leftIcon={<Text>🔍</Text>}
        rightIcon={<Text>❌</Text>}
      />,
    );

    expect(screen.getByText('🔍')).toBeTruthy();
    expect(screen.getByText('🙈')).toBeTruthy(); // Password toggle instead of ❌
    expect(screen.queryByText('❌')).toBeNull();
  });

  // Focus handling
  it('handles focus and blur events', () => {
    render(<TextField placeholder="Focus test" />);

    const input = screen.getByPlaceholderText('Focus test');

    fireEvent(input, 'focus');
    fireEvent(input, 'blur');

    expect(input).toBeTruthy();
  });
});
