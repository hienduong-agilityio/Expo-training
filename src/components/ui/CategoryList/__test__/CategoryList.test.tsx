import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { CategoryList } from '@app/components/ui/CategoryList';

// Types
import type { ICategory } from '@app/interfaces';

describe('CategoryList', () => {
  const mockCategories: ICategory[] = [
    {
      id: '1',
      name: 'Electronics',
      image: 'https://example.com/electronics.jpg',
    },
    {
      id: '2',
      name: 'Clothing',
      image: 'https://example.com/clothing.jpg',
    },
  ];

  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      categories: mockCategories,
      onCategoryPress: jest.fn(),
      ...overrides,
    };
    return render(<CategoryList {...defaultProps} />);
  };

  it('renders correctly with categories', () => {
    const { toJSON } = renderComponent();

    expect(screen.getByText('Electronics')).toBeTruthy();
    expect(screen.getByText('Clothing')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onCategoryPress when category is pressed', () => {
    const onCategoryPress = jest.fn();
    renderComponent({ onCategoryPress });

    fireEvent.press(screen.getByText('Electronics'));

    expect(onCategoryPress).toHaveBeenCalledWith('1');
  });

  it('renders empty list when categories array is empty', () => {
    const { toJSON } = renderComponent({ categories: [] });

    expect(screen.queryByText('Electronics')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
