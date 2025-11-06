import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';

// Components
import { CartItem } from './index';

// Mocks
import { MOCK_IMAGE_SOURCES } from '@app/mocks/images';

const meta: Meta<typeof CartItem> = {
  title: 'UI/CartItem',
  component: CartItem,
  args: {
    id: '1',
    name: 'Product 1',
    imageSource: MOCK_IMAGE_SOURCES.valid,
    quantity: 2,
    price: 1999,
  },
  parameters: {
    notes:
      'Cart item component with quantity controls and remove functionality.',
  },
  argTypes: {
    id: {
      description: 'Product identifier',
      control: 'text',
    },
    name: {
      description: 'Product name',
      control: 'text',
    },
    imageSource: {
      description: 'Product image source',
      control: 'object',
    },
    quantity: {
      description: 'Quantity of the item',
      control: { type: 'number', min: 1, max: 10 },
    },
    price: {
      description: 'Price per unit',
      control: { type: 'number', min: 0 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CartItem>;

export const Default: Story = {};

export const SingleItem: Story = {
  args: {
    quantity: 1,
  },
};

export const CartItems: Story = {
  render: () => (
    <View style={styles.container}>
      <CartItem
        id="1"
        name="Product 1"
        imageSource={MOCK_IMAGE_SOURCES.valid}
        quantity={1}
        price={1999}
      />
      <CartItem
        id="2"
        name="Product 2"
        imageSource={MOCK_IMAGE_SOURCES.valid}
        quantity={3}
        price={2999}
      />
      <CartItem
        id="3"
        name="Product 3"
        imageSource={MOCK_IMAGE_SOURCES.valid}
        quantity={11}
        price={1000}
      />
      <CartItem id="4" name="Product 4" quantity={2} price={999} />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
});
