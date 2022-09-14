import React from 'react';
import { render } from '@testing-library/react';

import { Button } from './button';

describe('Button', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Button variant="primary">
        <span>Welcome to button!</span>
      </Button>
    );
    expect(baseElement).toBeTruthy();
  });
});
