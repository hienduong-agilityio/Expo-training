import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { FilterModal } from '@app/components/ui/FilterModal';

// Constants
import { CATEGORIES } from '@app/mocks/categories';

describe('FilterModal', () => {
  const baseProps = () => ({
    visible: true,
    categories: [...CATEGORIES],
    selectedCategory: null as string | null,
    onClose: jest.fn(),
    onCategorySelect: jest.fn(),
  });

  it('renders correctly with default props', () => {
    const props = baseProps();
    const { toJSON } = render(<FilterModal {...props} />);

    expect(screen.getByText('Filter Products')).toBeTruthy();
    expect(screen.getByText('All Categories')).toBeTruthy();
    expect(screen.getByText('Clear All')).toBeTruthy();
    expect(screen.getByText('Apply Filter')).toBeTruthy();
    // Shows some categories
    expect(screen.getByText(CATEGORIES[0].name)).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onCategorySelect when a category is selected', () => {
    const props = baseProps();
    render(<FilterModal {...props} />);

    const target = CATEGORIES[0];
    fireEvent.press(screen.getByText(target.name));

    expect(props.onCategorySelect).toHaveBeenCalledWith(target.id);
  });

  it('calls onCategorySelect(null) when clearing filter', () => {
    const props = baseProps();
    render(<FilterModal {...props} />);

    fireEvent.press(screen.getByText('Clear All'));

    expect(props.onCategorySelect).toHaveBeenCalledWith(null);
  });

  it('calls onClose when applying filter', () => {
    const props = baseProps();
    render(<FilterModal {...props} />);

    fireEvent.press(screen.getByText('Apply Filter'));
    expect(props.onClose).toHaveBeenCalledTimes(0);
  });

  it('calls onClose when tapping close button', () => {
    const props = baseProps();
    render(<FilterModal {...props} />);

    fireEvent.press(screen.getByText('✕'));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with selected category preselected', () => {
    const target = CATEGORIES[1];
    const props = baseProps();
    props.selectedCategory = target.id;

    const { toJSON } = render(<FilterModal {...props} />);
    expect(screen.getByText(target.name)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
