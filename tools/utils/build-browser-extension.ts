import execa from 'execa';
import { remove, ensureDir, copy, move } from 'fs-extra';

(async function main() {
  const walletBuildProcess = build("wallet");
  if (!walletBuildProcess || !walletBuildProcess.stdout || !walletBuildProcess.stderr) {
    throw new Error('Something went wrong when building the "wallet" app');
  }
  walletBuildProcess.stdout.pipe(process.stdout);
  walletBuildProcess.stderr.pipe(process.stderr);

  await Promise.all([walletBuildProcess]);

  await remove('./dist/apps/wallet-unpacked');

  await ensureDir('./dist/apps/wallet-unpacked');

  await copy(
    './dist/apps/wallet/',
    './dist/apps/wallet-unpacked/'
  );

  await remove('./dist/apps/wallet-unpacked/assets/fonts');

  await move(
    './dist/apps/wallet-unpacked/assets/shared/manifest.json',
    './dist/apps/wallet-unpacked/manifest.json'
  );

  await move(
    './dist/libs/shared/background/main.js',
    './dist/apps/wallet-unpacked/background.js'
  );

  await move(
    './dist/libs/shared/content/main.js',
    './dist/apps/wallet-unpacked/content.js'
  );

  console.log(
    `Success! Unpacked browser extension is ready for use: dist/apps/wallet-unpacked`
  );
})();

function build(project: string) {
  return execa(
    'npx',
    [
      'nx',
      'build',
      project,
      '--prod',
      '--skip-nx-cache',
    ],
    {
      env: {
        NODE_ENV: 'production',
        INLINE_RUNTIME_CHUNK: 'false',
        GENERATE_SOURCEMAP: 'false',
      },
    }
  );
}
