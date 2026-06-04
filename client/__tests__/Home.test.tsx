import LoginPage from '@/app/login/page';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';


describe('Next.js Login Page', () => {
    it('renders the main heading', () => {
        render(<LoginPage />);
        const heading = screen.getByRole('button', { level: 1 });
        expect(heading).toBeInTheDocument();
    });
});