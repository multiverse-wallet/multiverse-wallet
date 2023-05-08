import { DropEvent } from '@react-types/shared';
import React, {
  useState,
  useRef,
  useCallback,
  DragEventHandler,
  ChangeEventHandler,
  LegacyRef,
  PropsWithChildren,
} from 'react';
import { ControllerRenderProps } from 'react-hook-form';

export interface DragDropProps {
  contentType?: string;
  label?: string;
  field?: ControllerRenderProps<any, any>;
  children: (props: DragDropChildProps) => React.ReactNode;
  setError?: (e: Error | undefined) => void;
}

export interface DragDropChildProps {
  file?: File;
}

// drag drop file component
export function DragDropFile({
  field,
  label,
  contentType,
  setError,
  children,
}: DragDropProps) {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>();

  // handle drag events
  const handleDrag: DragEventHandler<HTMLDivElement | HTMLFormElement> =
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

  // triggers when file is dropped
  const handleDrop: DragEventHandler<HTMLDivElement> = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (contentType && !file.type.startsWith(contentType)) {
        setError &&
          setError(
            new Error(`unsupported content type, must be ${contentType}`)
          );
      } else {
        // at least one file has been dropped so do something
        field?.onChange(file);
        setFile(file);
        setError && setError(undefined);
      }
    }
  };

  // triggers when file is selected with click
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (contentType && !file.type.startsWith(contentType)) {
        setError &&
          setError(
            new Error(`unsupported content type, must be ${contentType}`)
          );
      } else {
        // at least one file has been dropped so do something
        field?.onChange(file);
        setFile(file);
        setError && setError(undefined);
      }
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.click();
  }, [inputRef]);

  return (
    <div>
      <label className="block text-sm font-medium leading-5 text-gray-500 mb-2">
        {label}
      </label>
      <div
        className="relative border shadow-sm rounded-md p-8 text-sm text-gray-500"
        onDragEnter={handleDrag}
      >
        <div className="flex"></div>
        <input
          ref={inputRef as LegacyRef<HTMLInputElement>}
          type="file"
          className="hidden"
          multiple={false}
          onChange={handleChange}
        />
        {file && (
          <div>
            <p className="pb-3 flex items-center justify-center">
              {children({ file })}
            </p>
            <button
              className="w-full p-3 border shadow-sm rounded-md bg-slate-50"
              onClick={(e) => {
                e.preventDefault();
                if (inputRef && inputRef.current) {
                  inputRef.current.value = '';
                  setFile(undefined);
                }
              }}
            >
              Remove
            </button>
          </div>
        )}
        {!file && (
          <label
            htmlFor="input-file-upload"
            className={dragActive ? 'drag-active' : ''}
          >
            <div>
              <p className="pb-3 flex items-center justify-center">
                Drag and drop your file here or...
              </p>
              <button
                className="w-full p-3 border shadow-sm rounded-md bg-slate-50"
                onClick={(e) => {
                  e.preventDefault();
                  onButtonClick();
                }}
              >
                Upload a file
              </button>
            </div>
          </label>
        )}
        {dragActive && (
          <div
            className="absolute flex items-center justify-center bg-white w-full h-full top-0 left-0 right-0 bottom-0"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            Drop file to upload...
          </div>
        )}
      </div>
    </div>
  );
}
