import React from 'react';
import { Button } from './button';

const Spacer = () => (
  <span style={{ width: '10px', display: 'inline-block' }}></span>
);

export default {
  component: Button,
  title: 'Button',
  argTypes: { onPress: { action: 'pressed' } },
};

export const Basic = (args) => <Button {...args} />;
Basic.args = { children: 'Label' };

export const Variants = () => {
  return (
    <>
      <Button variant="primary">
        <span>Primary action</span>
      </Button>
      <Spacer />
      <Button variant="secondary">
        <span>Secondary action</span>
      </Button>
      <Spacer />
      <Button variant="dark">
        <span>Dark action</span>
      </Button>
      <Button variant="light">
        <span>Light action</span>
      </Button>
      <Spacer />
      <Button variant="cancel">
        <span>Cancel action</span>
      </Button>
      <Spacer />
      <Button variant="danger">
        <span>Something destructive</span>
      </Button>
    </>
  );
};

export const Sizes = () => {
  return (
    <>
      <Button variant="secondary" size="small">
        <span>Small</span>
      </Button>
      <Spacer />
      <Button variant="secondary" size="medium">
        <span>Medium</span>
      </Button>
    </>
  );
};
