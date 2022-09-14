# sort-json-configs

This generator helps us massively cut down on a common source of merge conflicts within the Nx workspace: our JSON config files.

By keeping key JSON configs sorted, git has a much easier time reconciling changes across different branches that were made at different times.

The generator does not require any options, it is simply run like so:

```sh
npx nx workspace-generator sort-json-configs
```

For more details on which configs are sorted, and in what way, check out the source code [./index.ts](./index.ts).
