# Security considerations

## Preview filter: arbitrary code execution

The `crawlee-one preview` command serves a local web UI to browse datasets. It includes a **filter feature** where users can enter a JavaScript expression in a textarea. This expression is evaluated on the server via `Function()`.

**Risk:** The expression runs arbitrary JavaScript. A malicious user could execute code such as `process.exit()`, access the filesystem, or exfiltrate data.

**Current mitigation:** The preview server is intended for **local development only**. The UI displays a warning: "This script runs on the server. Never publish this preview page." The threat model assumes the user runs the server on localhost and views their own data.

**If expanding this project:** Before exposing the preview UI beyond localhost, or before adding features that make it accessible to untrusted users, this must be addressed. Options include:

- Migrating the filter to a sandboxed expression language (e.g. [jexl](https://github.com/TechnologyAdvice/jexl))
- Running the filter in an isolated context (e.g. `vm2`, `isolated-vm`) — note that sandbox escape vulnerabilities have been reported for some of these
- Removing the filter or replacing it with a safe, declarative query format (no user-provided code)

See `src/lib/preview/filter.ts` for the current implementation and the inline comment about migration.
