import { render } from '@testing-library/react';

import WalletPopupFeatureTransaction from './transaction';

describe('WalletPopupFeatureTransaction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< WalletPopupFeatureTransaction />);
    expect(baseElement).toBeTruthy();
  });
});
