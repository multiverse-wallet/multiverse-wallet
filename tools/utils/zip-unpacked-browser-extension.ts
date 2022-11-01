/**
 * Adapted from https://github.com/thejoshwolfe/yazl/issues/39
 */
import { createWriteStream, readdir } from 'fs';
import { ensureDir, remove } from 'fs-extra';
import { join } from 'path';
import yazl from 'yazl';

type Callback = {
  (error?: any): void;
  (error: any): void;
  (arg0: undefined): void;
};

const noopCallback = Function.prototype as Callback;

function addDirectory(
  zip: yazl.ZipFile,
  realPath: string,
  metadataPath: string,
  cb: Callback
) {
  readdir(realPath, (error, files: string[]) => {
    if (error == null) {
      let i = files.length;
      let resolve: Callback = (error: any) => {
        if (error != null) {
          resolve = noopCallback;
          cb(error);
        } else if (--i === 0) {
          resolve = noopCallback;
          cb();
        }
      };

      files.forEach((file) => {
        addDirectory(
          zip,
          join(realPath, file),
          metadataPath + '/' + file,
          resolve
        );
      });
    } else if (error.code === 'ENOTDIR') {
      zip.addFile(realPath, metadataPath);
      cb();
    } else {
      cb(error);
    }
  });
}

const zip = new yazl.ZipFile();

addDirectory(
  zip,
  './dist/apps/wallet-unpacked',
  'multiverse-wallet',
  async (error: any) => {
    if (error) {
      return console.error(error);
    }

    await remove('./tmp/multiverse-wallet.zip');

    await ensureDir('./tmp/wallet-unpacked');

    zip.end();
    zip.outputStream.pipe(
      createWriteStream('./tmp/multiverse-wallet.zip')
    );
  }
);
