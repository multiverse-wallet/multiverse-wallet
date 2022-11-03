import React from 'react';
import { TextField, TextFieldProps } from './text-field';

const Spacer = () => (
  <span style={{ width: '10px', display: 'inline-block' }}></span>
);

export default {
  component: TextField,
  title: 'TextField',
};

export const Basic = (args: TextFieldProps) => (
  <div className="max-w-4xl m-auto bg-gray-50 p-12">
    <TextField {...args} />
  </div>
);
Basic.args = { label: 'Label' };

export const Placeholder = () => {
  return (
    <>
      <TextField
        label="Input with placeholder"
        placeholder="Placeholder value"
      />
      <Spacer />
    </>
  );
};

export const ValidationStates = () => {
  return (
    <>
      <TextField
        label="Explicitly Valid Input"
        validationState="valid"
        defaultValue="Valid value"
      />
      <Spacer />
      <TextField
        label="Invalid Input"
        validationState="invalid"
        defaultValue="Invalid value"
      />
      <Spacer />
    </>
  );
};

export const Disabled = () => {
  return (
    <>
      <TextField
        label="Disabled Input"
        isDisabled={true}
        defaultValue="Disabled"
      />
      <Spacer />
    </>
  );
};
