import React from 'react';

export interface ExampleComponentProps {
  children: any;
}

export default function ExampleComponent(props: ExampleComponentProps) {
  return (
    <div className="my-5">
      <div className="font-bold">Example</div>
      <div className="p-5 mb-5 mt-3 rounded-lg border-2">{props.children}</div>
    </div>
  );
}
