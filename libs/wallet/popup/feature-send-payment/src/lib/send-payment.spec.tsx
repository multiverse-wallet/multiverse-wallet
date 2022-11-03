import { render } from '@testing-library/react';

import SendPayment from './send-payment';

describe('SendPayment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< SendPayment />);
    expect(baseElement).toBeTruthy();
  });
});
