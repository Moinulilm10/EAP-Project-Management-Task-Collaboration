import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectCard, Project } from '../../components/projects/ProjectCard';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

const mockProject: Project = {
  id: 'p1',
  title: 'Test Project Title',
  description: 'Test Project Description',
  status: 'active',
  dueDate: 'Oct 15',
  progress: 75,
  memberCount: 3,
};

describe('ProjectCard Component', () => {
  it('should render project title, description, progress, and members', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Test Project Title')).toBeInTheDocument();
    expect(screen.getByText('Test Project Description')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('3 members')).toBeInTheDocument();
  });

  it('should render Admin badge if user is project admin', () => {
    render(<ProjectCard project={mockProject} isAdmin={true} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should render edit/delete buttons and trigger callbacks on click', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <ProjectCard
        project={mockProject}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

    const editBtn = screen.getByLabelText('Edit Project');
    const deleteBtn = screen.getByLabelText('Delete Project');

    expect(editBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith('p1');

    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith('p1');
  });
});
