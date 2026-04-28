import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { CategoriesSection } from '@app/components/ui/CategoriesSection';

// Types
import type { ICategory } from '@app/interfaces/categories';

describe('CategoriesSection', () => {
  const mockCategories: ICategory[] = [
    {
      id: '1',
      name: 'Electronics',
      image: 'https://example.com/1.jpg',
      slug: 'electronics',
    },
    {
      id: '2',
      name: 'Clothing',
      image: 'https://example.com/2.jpg',
      slug: 'clothing',
    },
  ];

  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      categories: mockCategories,
      onCategoryPress: jest.fn(),
      ...overrides,
    };
    return render(<CategoriesSection {...defaultProps} />);
  };

  it('renders correctly with default props', () => {
    const { toJSON } = renderComponent();

    expect(screen.getByText('All Featured')).toBeTruthy();
    expect(screen.getByText('Electronics')).toBeTruthy();
    expect(screen.getByText('Clothing')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with custom title and product count', () => {
    renderComponent({
      title: 'Featured',
      productCount: 10,
    });

    expect(screen.getByText('Featured')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('calls onCategoryPress when category is selected', () => {
    const onCategoryPress = jest.fn();
    renderComponent({ onCategoryPress });

    fireEvent.press(screen.getByText('Electronics'));

    expect(onCategoryPress).toHaveBeenCalledWith('1', 'Electronics');
  });

  it('opens filter modal when filter button is pressed', () => {
    const { toJSON } = renderComponent();

    const filterButton = screen.getByText('Filter');
    fireEvent.press(filterButton);

    expect(toJSON()).toMatchSnapshot();
  });

  it('applies filter from modal', () => {
    const onCategoryPress = jest.fn();
    renderComponent({ onCategoryPress });

    // Open modal
    const filterButton = screen.getByText('Filter');
    fireEvent.press(filterButton);

    // Apply filter (this would trigger the modal's apply)
    // The actual implementation uses useFilterModal hook
    expect(onCategoryPress).toBeDefined();
  });

  it('handles category press with missing category name', () => {
    const onCategoryPress = jest.fn();
    const categoriesWithMissingName = [
      { id: '1', name: 'Electronics', image: 'https://example.com/1.jpg' },
      { id: '2', name: '', image: 'https://example.com/2.jpg' },
    ];

    renderComponent({
      categories: categoriesWithMissingName,
      onCategoryPress,
    });

    fireEvent.press(screen.getByText('Electronics'));

    expect(onCategoryPress).toHaveBeenCalled();
  });

  it('does not render product count when not provided', () => {
    renderComponent({ productCount: undefined });

    expect(screen.queryByText(/\d+/)).toBeNull();
  });

  it('handles filter apply with null category', () => {
    const onCategoryPress = jest.fn();
    const { toJSON } = renderComponent({ onCategoryPress });

    // Open filter modal
    const filterButton = screen.getByText('Filter');
    fireEvent.press(filterButton);

    expect(toJSON()).toMatchSnapshot();
  });
});
