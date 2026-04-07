import { render, screen, within } from '@testing-library/react-native';
import { View } from 'react-native';

// Components
import { PaginationDots } from '@app/components/ui/PaginationDots';

describe('PaginationDots', () => {
  const renderComponent = (currentIndex: number, totalCount: number) => {
    render(
      <PaginationDots currentIndex={currentIndex} totalCount={totalCount} />,
    );
  };

  it('matches snapshot', () => {
    const { toJSON } = render(
      <PaginationDots currentIndex={0} totalCount={5} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correct number of dots', () => {
    renderComponent(0, 5);

    const container = screen.getByLabelText('Pagination dots');
    expect(container).toBeTruthy();

    const dots = within(container).UNSAFE_getAllByType(View);
    expect(dots).toHaveLength(5);
  });

  it('renders single dot', () => {
    renderComponent(0, 1);

    const container = screen.getByLabelText('Pagination dots');
    expect(container).toBeTruthy();

    const dots = within(container).UNSAFE_getAllByType(View);
    expect(dots).toHaveLength(1);
  });
});
