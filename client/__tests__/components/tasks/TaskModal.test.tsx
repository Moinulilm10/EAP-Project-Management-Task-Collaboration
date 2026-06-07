import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskModal } from '../../../components/tasks/TaskModal';

// Mock dependencies
vi.mock('../../../stores/projectStore', () => {
  const store = {
    projects: [
      { id: 'p1', name: 'Project 1', createdAt: new Date('2025-01-01').toISOString(), deadline: new Date('2025-12-31').toISOString() }
    ],
    fetchProjects: vi.fn(),
  };
  return { useProjectStore: () => store };
});

vi.mock('../../../stores/teamStore', () => {
  const store = {
    teams: [{ id: 't1', name: 'Team Alpha', projectId: 'p1' }],
    fetchTeams: vi.fn(),
  };
  return { useTeamStore: () => store };
});

vi.mock('../../../stores/projectMemberStore', () => {
  const store = {
    members: [{ id: 'm1', user: { id: 'u1', name: 'John Doe', email: 'j@d.com' } }],
    fetchMembers: vi.fn(),
  };
  return { useProjectMemberStore: () => store };
});

// Provide translation mock
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe('TaskModal', () => {
  const onSaveMock = vi.fn();
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders New Task when no initial data provided', () => {
    render(<TaskModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('renders Edit Task when initial data is provided', () => {
    const initialData = { id: '1', title: 'Edit Me', projectId: 'p1', status: 'todo' };
    render(<TaskModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} initial={initialData as any} />);
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
  });

  it('displays error if required fields are missing', async () => {
    render(<TaskModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} />);
    
    const saveButton = screen.getByRole('button', { name: /Create|Save/i });
    fireEvent.click(saveButton);
    
    // It should block if title or projectId is missing
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('displays inline error if deadline is in the past', async () => {
    render(<TaskModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} />);
    
    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    await userEvent.type(titleInput, 'Future Task');
    
    // Select project
    const projectSelect = screen.getByText('Select a project');
    fireEvent.click(projectSelect);
    const pOption = screen.getByText('Project 1');
    fireEvent.click(pOption);

    // Set past date
    const dateInput = screen.getByLabelText(/due date/i) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-01-01' } });

    const saveButton = screen.getByRole('button', { name: /Create|Save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a valid deadline.')).toBeInTheDocument();
    });
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('displays inline error if reassigning a completed task', async () => {
    const initialData = { 
      id: '1', 
      title: 'Done Task', 
      projectId: 'p1', 
      status: 'done',
      assigneeId: 'u1',
      assignee: { id: 'u1', name: 'John Doe' }
    };
    
    render(<TaskModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} initial={initialData as any} />);
    
    // Try to reassign to Unassigned
    const assigneeSelect = screen.getByText('John Doe'); // Assuming this triggers dropdown
    fireEvent.click(assigneeSelect);
    
    const unassignOption = screen.getByText('Unassigned');
    fireEvent.click(unassignOption);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Completed tasks cannot be reassigned.')).toBeInTheDocument();
    });
    expect(onSaveMock).not.toHaveBeenCalled();
  });
});
