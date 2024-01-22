import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginPage from './login';

describe('Login Page', () => {
  it('should render the login page', () => {
    render(<LoginPage />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: "Remember me" })).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });
});
