import { render, screen } from '@testing-library/react-native';

// Components
import { OnboardingSlide } from '../index';

// Interfaces
import { IOnboardingItem } from '@app/interfaces';

describe('OnboardingSlide', () => {
  const mockItem: IOnboardingItem = {
    id: '1',
    icon: null,
    title: 'Choose Products',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
  };

  describe('Rendering', () => {
    it('renders slide with title and description', () => {
      const { toJSON } = render(<OnboardingSlide item={mockItem} />);

      expect(screen.getByText('Choose Products')).toBeTruthy();
      expect(
        screen.getByText(
          'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
        ),
      ).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders with different content', () => {
      const differentItem: IOnboardingItem = {
        id: '2',
        icon: null,
        title: 'Make Payment',
        description: 'Different description content for testing.',
      };

      const { toJSON } = render(<OnboardingSlide item={differentItem} />);

      expect(screen.getByText('Make Payment')).toBeTruthy();
      expect(
        screen.getByText('Different description content for testing.'),
      ).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility labels', () => {
      render(<OnboardingSlide item={mockItem} />);

      const titleElement = screen.getByLabelText('Choose Products');
      const descriptionElement = screen.getByLabelText(
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
      );

      expect(titleElement).toBeTruthy();
      expect(descriptionElement).toBeTruthy();
    });

    it('has correct accessibility roles', () => {
      render(<OnboardingSlide item={mockItem} />);

      const titleElement = screen.getByRole('header');
      const descriptionElement = screen.getByRole('text');

      expect(titleElement).toBeTruthy();
      expect(descriptionElement).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('renders icon container', () => {
      const { toJSON } = render(<OnboardingSlide item={mockItem} />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('handles empty icon gracefully', () => {
      const itemWithoutIcon: IOnboardingItem = {
        id: '3',
        icon: null,
        title: 'No Icon',
        description: 'This slide has no icon.',
      };

      const { toJSON } = render(<OnboardingSlide item={itemWithoutIcon} />);

      expect(screen.getByText('No Icon')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
