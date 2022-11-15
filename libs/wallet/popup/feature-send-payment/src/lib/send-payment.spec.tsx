import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import SendPayment from './send-payment';

describe('SendPayment', () => {
  it.skip('should render successfully', () => {
    const { baseElement } = render(<SendPayment />, { wrapper: BrowserRouter });
    expect(baseElement).toBeTruthy();
  });
});
