import { OverlayContainer } from '@react-aria/overlays';
import { render } from '@testing-library/react';
import React from 'react';
import { ModalDialog } from './modal-dialog';

describe('ModalDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <OverlayContainer>
        <ModalDialog
          render={(titleProps) => (
            <div>
              <h2 {...titleProps}>Title</h2>
            </div>
          )}
        />
      </OverlayContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});
