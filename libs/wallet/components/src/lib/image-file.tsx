import React, { useEffect, useState } from 'react';

export interface ImageFileProps {
  file?: File;
  [x: string]: any;
}

export function ImageFile(props: ImageFileProps) {
  const [dataUri, setDataUri] = useState<string>();
  useEffect(() => {
    if (!props.file) return;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      setDataUri(e?.target?.result as string);
    };
    reader.readAsDataURL(props.file);
  }, [props.file]);
  return <img src={dataUri} {...props} />;
}
