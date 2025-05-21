import React from 'react';

import { render, screen } from '@testing-library/react';
import { Formiz } from '@formiz/core';

import { BlogForm } from './BlogForm';

describe('BlogForm', () => {
  it('renders the blog form with title and content fields', () => {
    render(
      <Formiz>
        <BlogForm />
      </Formiz>
    );
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });
});