import { render } from '@testing-library/react';

import Connect from './connect';

describe('Connect', () => {
  it.skip('should render successfully', () => {
    const { baseElement } = render(<Connect />);
    expect(baseElement).toBeTruthy();
  });
});
