import React from 'react';
import { render } from '@testing-library/react';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Checkbox aria-label="test" />);
    expect(baseElement).toBeTruthy();
  });
});
