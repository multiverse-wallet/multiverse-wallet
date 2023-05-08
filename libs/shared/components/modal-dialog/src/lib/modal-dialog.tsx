import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import {
  AriaOverlayProps,
  useModal,
  useOverlay,
  usePreventScroll,
} from '@react-aria/overlays';
import { AriaDialogProps } from '@react-types/dialog';
import React, {
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
  useRef,
} from 'react';

export type ModalTitleProps = HTMLAttributes<HTMLElement>;

interface ModalDialogProps extends AriaOverlayProps, AriaDialogProps {
  size?: 'medium' | 'large';
  render: (titleProps: ModalTitleProps) => JSX.Element;
}

interface ModalDialogHeaderProps {
  title: string;
  subtitle?: string;
  titleProps: ModalTitleProps;
}

// titleProps should be passed in from the outer usage of useDialog()
export function ModalDialogHeader({
  title,
  subtitle,
  titleProps,
}: ModalDialogHeaderProps) {
  return (
    <div className="bg-white py-7 px-5 sm:p-8 border-b border-gray-200">
      <h3
        className="text-2xl leading-6 font-bold text-gray-900"
        {...titleProps}
      >
        {title}
      </h3>
      {subtitle && (
        <p className="mt-2 text-sm leading-5 text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}

interface ModalDialogBodyProps {
  hasPadding?: boolean;
}

export const ModalDialogBody: FunctionComponent<ModalDialogBodyProps & any> = ({
  children,
  hasPadding,
}) => {
  hasPadding = hasPadding ?? true;
  return (
    <div
      className={`bg-white max-h-[60vh] overflow-auto ${
        hasPadding ? 'py-7 px-8' : '-m-1'
      }`}
    >
      {children}
    </div>
  );
};

export const ModalDialogFooter = ({ children }: any) => {
  return (
    <div className="bg-gray-50 px-5 py-5 sm:px-8 flex flex-row-reverse">
      {children}
    </div>
  );
};

export function ModalDialog(props: ModalDialogProps) {
  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = useRef(null);
  const { overlayProps } = useOverlay(props as any, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  const { modalProps } = useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog(props, ref);

  const size = props.size ?? 'medium';

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all mx-2 sm:my-8 sm:align-middle ${
            size === 'medium' ? 'sm:max-w-lg sm:w-full' : ''
          } ${size === 'large' ? 'sm:max-w-4xl sm:w-full' : ''}`}
        >
          {props.render(titleProps)}
        </div>
      </FocusScope>
    </div>
  );
}
