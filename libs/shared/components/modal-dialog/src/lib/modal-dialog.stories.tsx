import { Button } from '@multiverse-wallet/shared/components/button';
import { TextField } from '@multiverse-wallet/shared/components/text-field';
import { OverlayContainer } from '@react-aria/overlays';
import React, { useRef } from 'react';
import {
  ModalDialog,
  ModalDialogBody,
  ModalDialogFooter,
  ModalDialogHeader,
} from './modal-dialog';

const Spacer = () => (
  <span style={{ width: '10px', display: 'inline-block' }}></span>
);

export default {
  component: ModalDialog,
  title: 'ModalDialog',
};

export const Basic = () => {
  const ref = useRef(null);

  return (
    <OverlayContainer>
      <ModalDialog
        isOpen
        render={(titleProps) => (
          <>
            <ModalDialogHeader
              titleProps={titleProps}
              title="Create Account"
              subtitle="A unique Public and Private key pair will be generated in your browser and stored locally using the name you specify."
            />

            <ModalDialogBody>
              <div className="">
                <TextField
                  type="text"
                  label="Account Name"
                  placeholder="My Awesome Account"
                  autoFocus={true}
                  defaultValue=""
                  inputRef={ref}
                  name="foo"
                />
              </div>
            </ModalDialogBody>

            <ModalDialogFooter>
              <span className="ml-2">
                <Button variant="primary" size="medium">
                  <>
                    <svg
                      className="-ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    Generate Keys
                  </>
                </Button>
              </span>
              <Button variant="cancel" size="medium">
                Cancel
              </Button>
            </ModalDialogFooter>
          </>
        )}
      />
    </OverlayContainer>
  );
};

export const Header = () => (
  <OverlayContainer>
    <ModalDialog
      render={(titleProps) => (
        <>
          <ModalDialogHeader
            titleProps={titleProps}
            title="This is the title"
            subtitle="This is a subtitle, ideal for describing things in more detail."
          />
          <ModalDialogBody></ModalDialogBody>
        </>
      )}
    />
  </OverlayContainer>
);

export const Body = () => (
  <OverlayContainer>
    <ModalDialog
      render={() => (
        <ModalDialogBody>
          <div>Arbitrary body contents</div>
        </ModalDialogBody>
      )}
    />
  </OverlayContainer>
);

export const Footer = () => (
  <OverlayContainer>
    <ModalDialog
      render={() => (
        <>
          <ModalDialogBody></ModalDialogBody>
          <ModalDialogFooter>
            <span className="ml-2">
              <Button variant="primary" size="medium">
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  Generate Keys
                </>
              </Button>
            </span>
            <Button variant="cancel" size="medium">
              Cancel
            </Button>
          </ModalDialogFooter>
        </>
      )}
    />
  </OverlayContainer>
);
