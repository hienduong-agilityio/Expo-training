import { Text } from 'react-native';
import { Button } from '../index';
import { render, screen } from 'test-utils';

describe('Button', () => {
  it('should render properly', () => {
    const { toJSON } = render(
      <Button>
        <Text>Press me</Text>
      </Button>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correct content in the button', () => {
    render(
      <Button>
        <Text>Press me</Text>
      </Button>,
    );
    expect(screen.getByText('Press me')).toBeVisible();
  });
});
