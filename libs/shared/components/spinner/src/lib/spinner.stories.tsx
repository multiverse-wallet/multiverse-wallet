import React from 'react';
import { Spinner } from './spinner';

export default {
  component: Spinner,
  title: 'Spinner',
};

const Spacer = () => (
  <span style={{ width: '10px', display: 'inline-block' }}></span>
);

const ColoredContainer = ({ children, bgClassName }: any) => (
  <div
    className={`${
      bgClassName || 'bg-gray-300'
    } p-12 w-64 h-64 flex justify-center items-center`}
  >
    {children}
  </div>
);

export const Basic = (args: any) => (
  <ColoredContainer>
    <Spinner {...args} />
  </ColoredContainer>
);

export const Sizes = () => {
  return (
    <>
      <ColoredContainer>
        <Spinner size="small" />
      </ColoredContainer>
      <Spacer />
      <ColoredContainer>
        <Spinner size="medium" />
      </ColoredContainer>
      <Spacer />
      <ColoredContainer>
        <Spinner size="large" />
      </ColoredContainer>
    </>
  );
};

export const Variants = () => {
  return (
    <>
      <ColoredContainer bgClassName="bg-gradient-to-r from-green-400 to-teal-600">
        <Spinner variant="light" />
      </ColoredContainer>
      <Spacer />
      <ColoredContainer bgClassName="bg-gray-100">
        <Spinner variant="dark" />
      </ColoredContainer>
    </>
  );
};
