import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, Text, StyleSheet } from 'react-native';

const BUTTON_BACKGROUND_COLOR = '#2563eb';
const BUTTON_TEXT_COLOR = '#ffffff';

export const Button = ({
  children,
  ...rest
}: PropsWithChildren<PressableProps>) => {
  return (
    <Pressable style={styles.button} {...rest}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: BUTTON_BACKGROUND_COLOR,
    padding: 10,
  },

  text: {
    color: BUTTON_TEXT_COLOR,
    textAlign: 'center',
  },
});
