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

  // Focus handling
  it('handles focus and blur events', () => {
    render(<TextField placeholder="Focus test" />);

    const input = screen.getByPlaceholderText('Focus test');

    fireEvent(input, 'focus');
    fireEvent(input, 'blur');

    expect(input).toBeTruthy();
  });

  it('renders without label', () => {
    const { toJSON } = render(<TextField placeholder="No label" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders without left icon', () => {
    const { toJSON } = render(
      <TextField placeholder="No left icon" rightIcon={<Text>👁️</Text>} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders without right icon', () => {
    const { toJSON } = render(
      <TextField placeholder="No right icon" leftIcon={<Text>🔒</Text>} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with right icon and onRightPress', () => {
    const onRightPress = jest.fn();
    const { toJSON } = render(
      <TextField
        placeholder="Test"
        rightIcon={<Text>👁️</Text>}
        onRightPress={onRightPress}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders password field with right icon', () => {
    const { toJSON } = render(
      <TextField
        placeholder="Password"
        rightIcon={<Text>👁️</Text>}
        isSecureText={true}
      />,
    );

    const input = screen.getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { toJSON } = render(
        <TextField placeholder={`Size ${size}`} size={size} />,
      );
      expect(toJSON()).toMatchSnapshot(`size-${size}`);
    });
  });

  it('renders with FILLED variant', () => {
    const { toJSON } = render(
      <TextField
        placeholder="Filled variant"
        variant={TEXTFIELD_VARIANTS.FILLED}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows border color changes on focus', () => {
    const { toJSON } = render(<TextField placeholder="Focus test" />);

    const input = screen.getByPlaceholderText('Focus test');
    fireEvent(input, 'focus');

    expect(toJSON()).toMatchSnapshot();
  });

  it('shows error border color', () => {
    const { toJSON } = render(
      <TextField placeholder="Error test" error="Error message" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows primary border color on focus when no error', () => {
    const { toJSON } = render(<TextField placeholder="Focus test" />);

    const input = screen.getByPlaceholderText('Focus test');
    fireEvent(input, 'focus');

    expect(toJSON()).toMatchSnapshot();
  });

  it('shows default border color when not focused and no error', () => {
    const { toJSON } = render(<TextField placeholder="Default test" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('handles secureTextEntry with showPassword state', () => {
    const { toJSON } = render(
      <TextField
        placeholder="Password"
        isSecureText={true}
        rightIcon={<Text>👁️</Text>}
      />,
    );

    const input = screen.getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
    expect(toJSON()).toMatchSnapshot();
  });

  it('handles secureTextEntry when isSecureText is false', () => {
    const { toJSON } = render(
      <TextField placeholder="Text" isSecureText={false} />,
    );

    const input = screen.getByPlaceholderText('Text');
    expect(input.props.secureTextEntry).toBeFalsy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders error text when error is provided', () => {
    render(<TextField placeholder="Test" error="Error message" />);

    expect(screen.getByText('Error message')).toBeTruthy();
  });

  it('does not render error text when error is not provided', () => {
    render(<TextField placeholder="Test" />);

    expect(screen.queryByText(/Error/)).toBeNull();
  });

  it('renders with OUTLINED variant by default', () => {
    const { toJSON } = render(<TextField placeholder="Test" />);

    expect(toJSON()).toMatchSnapshot();
  });
});
