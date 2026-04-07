import { render, fireEvent, screen } from '@testing-library/react-native';

// Components
import { FilterButtons } from '@app/components/ui/FilterButton';

jest.mock('@app/icons', () => ({
  FilterIcon: () => null,
  SortIcon: () => null,
}));

describe('<FilterButtons />', () => {
  const renderFilterButtons = (overrides = {}) => {
    return render(<FilterButtons {...overrides} />);
  };

  it('renders both buttons by default', () => {
    renderFilterButtons();

    expect(screen.getByLabelText('Filter results')).toBeTruthy();
    expect(screen.getByLabelText('Sort results')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('triggers handlers when pressed', () => {
    const onFilterPress = jest.fn();
    const onSortPress = jest.fn();

    renderFilterButtons({ onFilterPress, onSortPress });

    fireEvent.press(screen.getByLabelText('Filter results'));
    fireEvent.press(screen.getByLabelText('Sort results'));

    expect(onFilterPress).toHaveBeenCalledTimes(1);
    expect(onSortPress).toHaveBeenCalledTimes(1);
  });

  it('hides Filter when showFilter=false', () => {
    const { toJSON } = renderFilterButtons({ showFilter: false });

    expect(screen.queryByLabelText('Filter results')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);

    expect(toJSON()).toMatchSnapshot();
  });

  it('hides Sort when showSort=false', () => {
    const { toJSON } = renderFilterButtons({ showSort: false });

    expect(screen.queryByLabelText('Sort results')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);

    expect(toJSON()).toMatchSnapshot();
  });
});
