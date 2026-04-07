import { render } from '@testing-library/react-native';

// Components
import { StarsRating } from '@app/components/ui/StarsRating';

describe('StarsRating', () => {
  it('renders with default maxRating of 5', () => {
    const { toJSON } = render(<StarsRating rating={3} />);

    expect(toJSON()).toMatchSnapshot();
  });
});
