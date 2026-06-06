import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from '../../components/ui/Select';

// Mock framer-motion to prevent exit animation asynchronous timing issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

describe('Select Component (Custom Dropdown)', () => {
  it('should render selected option label initially', () => {
    render(<Select options={options} value="b" />);
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('should toggle options menu on trigger button click', async () => {
    render(<Select options={options} value="a" />);

    // Options menu should not be in document
    expect(screen.queryByText('Option B')).not.toBeInTheDocument();

    const triggerBtn = screen.getByRole('button');
    fireEvent.click(triggerBtn);

    // Options menu should be visible now
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();

    fireEvent.click(triggerBtn);
    // Options menu should be hidden
    expect(screen.queryByText('Option B')).not.toBeInTheDocument();
  });

  it('should call onChange and close menu when option is clicked', () => {
    const handleChange = vi.fn();
    render(<Select options={options} value="a" onChange={handleChange} />);

    const triggerBtn = screen.getByRole('button');
    fireEvent.click(triggerBtn);

    const optionB = screen.getByText('Option B');
    fireEvent.click(optionB);

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls[0][0].target.value).toBe('b');

    // Menu should be closed
    expect(screen.queryByText('Option C')).not.toBeInTheDocument();
  });
});
