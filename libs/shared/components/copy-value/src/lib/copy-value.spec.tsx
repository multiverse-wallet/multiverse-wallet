import React from 'react';
import { render } from '@testing-library/react';

import { CopyValue } from './copy-value';

describe('CopyValue', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CopyValue
        valueToCopy=""
        render={() => {
          return <div>Stuff here</div>;
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
