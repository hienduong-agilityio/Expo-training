import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { OnboardingNavigation } from '../index';

describe('OnboardingNavigation', () => {
  const defaultProps = {
    currentIndex: 0,
    totalCount: 3,
    onPrev: jest.fn(),
    onNext: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders navigation buttons', () => {
      const { toJSON } = render(<OnboardingNavigation {...defaultProps} />);

      expect(screen.getByText('Prev')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('shows "Get Started" on last page', () => {
      const lastPageProps = { ...defaultProps, currentIndex: 2 };
      const { toJSON } = render(<OnboardingNavigation {...lastPageProps} />);

      expect(screen.getByText('Prev')).toBeTruthy();
      expect(screen.getByText('Get Started')).toBeTruthy();
      expect(screen.queryByText('Next')).toBeFalsy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Interactions', () => {
    it('calls onPrev when prev button is pressed', () => {
      const props = { ...defaultProps, currentIndex: 1 };
      render(<OnboardingNavigation {...props} />);

      const prevButton = screen.getByText('Prev');
      fireEvent.press(prevButton);

      expect(props.onPrev).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when next button is pressed', () => {
      render(<OnboardingNavigation {...defaultProps} />);

      const nextButton = screen.getByText('Next');
      fireEvent.press(nextButton);

      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when "Get Started" is pressed on last page', () => {
      const lastPageProps = { ...defaultProps, currentIndex: 2 };
      render(<OnboardingNavigation {...lastPageProps} />);

      const getStartedButton = screen.getByText('Get Started');
      fireEvent.press(getStartedButton);

      expect(lastPageProps.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button States', () => {
    it('disables prev button on first page', () => {
      const firstPageProps = { ...defaultProps, currentIndex: 0 };
      render(<OnboardingNavigation {...firstPageProps} />);

      const prevButton = screen.getByText('Prev');
      fireEvent.press(prevButton);

      expect(firstPageProps.onPrev).not.toHaveBeenCalled();
    });

    it('enables prev button on subsequent pages', () => {
      const secondPageProps = { ...defaultProps, currentIndex: 1 };
      render(<OnboardingNavigation {...secondPageProps} />);

      const prevButton = screen.getByText('Prev');
      fireEvent.press(prevButton);

      expect(secondPageProps.onPrev).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility labels', () => {
      render(<OnboardingNavigation {...defaultProps} />);

      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');

      expect(prevButton).toBeTruthy();
      expect(nextButton).toBeTruthy();
    });

    it('has correct accessibility label for last page', () => {
      const lastPageProps = { ...defaultProps, currentIndex: 2 };
      render(<OnboardingNavigation {...lastPageProps} />);

      const getStartedButton = screen.getByLabelText('Get started');
      expect(getStartedButton).toBeTruthy();
    });

    it('shows disabled state for prev button on first page', () => {
      const firstPageProps = { ...defaultProps, currentIndex: 0 };
      render(<OnboardingNavigation {...firstPageProps} />);

      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toHaveProp('accessibilityState', { disabled: true });
    });
  });

  describe('Edge Cases', () => {
    it('handles single page correctly', () => {
      const singlePageProps = {
        ...defaultProps,
        totalCount: 1,
        currentIndex: 0,
      };
      const { toJSON } = render(<OnboardingNavigation {...singlePageProps} />);

      expect(screen.getByText('Prev')).toBeTruthy();
      expect(screen.getByText('Get Started')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('handles large page counts', () => {
      const largePageProps = {
        ...defaultProps,
        totalCount: 10,
        currentIndex: 5,
      };
      const { toJSON } = render(<OnboardingNavigation {...largePageProps} />);

      expect(screen.getByText('Prev')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
