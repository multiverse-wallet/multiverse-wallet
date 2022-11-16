import { AriaCheckboxProps, useCheckbox } from '@react-aria/checkbox';
import React, { RefObject, useRef } from 'react';
import { useToggleState } from 'react-stately';
import { ControllerRenderProps } from 'react-hook-form';

/**
 * We create an explicit first-party interface (rather than just extending
 * from react-aria), so that Storybook can automatically create the controls
 * for us in the playground.
 */
export interface CheckboxProps {
  label?: string;
  validationState?: AriaCheckboxProps['validationState'];
  isDisabled?: AriaCheckboxProps['isDisabled'];
  value?: AriaCheckboxProps['value'];
  name?: AriaCheckboxProps['name'];
  id?: AriaCheckboxProps['id'];
  onChange?: AriaCheckboxProps['onChange'];
  onBlur?: AriaCheckboxProps['onBlur'];
  className?: string;
  field?: ControllerRenderProps<any, any>;
}

export const Checkbox = (props: CheckboxProps) => {
  const toggleState = useToggleState({ isSelected: props.field?.value });
  const { inputProps } = useCheckbox(
    props,
    toggleState,
    props.field?.ref as any
  );
  return (
    <div className={props.className}>
      <label className="block text-sm font-medium leading-5 text-gray-500 flex gap-2">
        {props.label}
        <input type="checkbox" {...inputProps} {...props.field} />
      </label>
    </div>
  );
};

Checkbox.defaultProps = {};
