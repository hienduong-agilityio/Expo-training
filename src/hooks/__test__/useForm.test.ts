import { renderHook, act } from '@testing-library/react-native';
import { useForm } from '../useForm';

describe('useForm', () => {
  it('initializes with initial values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@example.com', password: '' },
      }),
    );

    expect(result.current.values).toEqual({
      email: 'test@example.com',
      password: '',
    });
    expect(result.current.fieldErrors).toEqual({});
  });

  it('updates value on handleChange', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '', password: '' },
      }),
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('clears field error when value changes', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '', password: '' },
      }),
    );

    act(() => {
      result.current.setFieldError('email', 'Invalid email');
    });

    expect(result.current.fieldErrors.email).toBe('Invalid email');

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.fieldErrors.email).toBe('');
  });

  it('sets field error', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '', password: '' },
      }),
    );

    act(() => {
      result.current.setFieldError('email', 'Email is required');
    });

    expect(result.current.fieldErrors.email).toBe('Email is required');
  });

  it('resets form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'initial@example.com', password: '' },
      }),
    );

    act(() => {
      result.current.handleChange('email', 'updated@example.com');
      result.current.handleChange('password', 'password123');
      result.current.setFieldError('email', 'Error');
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual({
      email: 'initial@example.com',
      password: '',
    });
    expect(result.current.fieldErrors).toEqual({});
  });

  it('handles multiple fields', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          firstName: '',
          lastName: '',
          email: '',
        },
      }),
    );

    act(() => {
      result.current.handleChange('firstName', 'John');
      result.current.handleChange('lastName', 'Doe');
      result.current.handleChange('email', 'john@example.com');
    });

    expect(result.current.values).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });
  });

  it('does not clear field error when field has no error', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '', password: '' },
      }),
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.fieldErrors).toEqual({});
  });

  it('preserves other field errors when clearing one', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '', password: '' },
      }),
    );

    act(() => {
      result.current.setFieldError('email', 'Invalid email');
      result.current.setFieldError('password', 'Required');
    });

    expect(result.current.fieldErrors).toEqual({
      email: 'Invalid email',
      password: 'Required',
    });

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.fieldErrors).toEqual({
      email: '',
      password: 'Required',
    });
  });
});
