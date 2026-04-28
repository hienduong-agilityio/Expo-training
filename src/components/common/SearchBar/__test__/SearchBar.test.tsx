import { render, screen, fireEvent } from '@testing-library/react-native';

// Components
import { SearchBar } from '@app/components/common/SearchBar';

describe('SearchBar', () => {
  const defaultPlaceholder = 'Search for products';

  const renderSearchBar = (overrides = {}) => {
    return render(
      <SearchBar value={''} onChangeText={jest.fn()} {...overrides} />,
    );
  };

  it('matches default snapshot', () => {
    const view = renderSearchBar();
    expect(view).toMatchSnapshot();
  });

  it('renders with default placeholder', () => {
    renderSearchBar();

    expect(screen.getByPlaceholderText(defaultPlaceholder)).toBeTruthy();
  });

  it('supports custom placeholder', () => {
    renderSearchBar({ placeholder: 'Type here...' });

    expect(screen.getByPlaceholderText('Type here...')).toBeTruthy();
  });

  it('calls onChangeText when typing', () => {
    const onChangeText = jest.fn();
    renderSearchBar({ onChangeText });

    fireEvent.changeText(
      screen.getByPlaceholderText(defaultPlaceholder),
      'shoe',
    );

    expect(onChangeText).toHaveBeenCalledWith('shoe');
  });

  it('calls onSubmitEditing when submitting', () => {
    const onSubmitEditing = jest.fn();
    renderSearchBar({ onSubmitEditing });

    fireEvent(
      screen.getByPlaceholderText(defaultPlaceholder),
      'submitEditing',
      {
        nativeEvent: { text: 'coat' },
      },
    );

    expect(onSubmitEditing).toHaveBeenCalled();
  });

  it('calls onMicrophonePress when microphone is pressed', () => {
    const onMicrophonePress = jest.fn();
    renderSearchBar({ onMicrophonePress, showMicrophone: true });

    fireEvent.press(screen.getByLabelText('Voice search'));

    expect(onMicrophonePress).toHaveBeenCalled();
  });

  it('hides microphone when showMicrophone is false', () => {
    renderSearchBar({ showMicrophone: false });

    expect(screen.queryByLabelText('Voice search')).toBeFalsy();
  });

  it('handles undefined onSubmitEditing', () => {
    renderSearchBar({ onSubmitEditing: undefined });

    const input = screen.getByPlaceholderText(defaultPlaceholder);
    fireEvent(input, 'submitEditing', {
      nativeEvent: { text: 'test' },
    });

    // Should not throw error
    expect(input).toBeTruthy();
  });

  it('handles undefined onMicrophonePress', () => {
    renderSearchBar({ onMicrophonePress: undefined, showMicrophone: true });

    const microphoneButton = screen.getByLabelText('Voice search');
    fireEvent.press(microphoneButton);

    // Should not throw error
    expect(microphoneButton).toBeTruthy();
  });

  it('renders microphone by default', () => {
    renderSearchBar();

    expect(screen.getByLabelText('Voice search')).toBeTruthy();
  });
});
