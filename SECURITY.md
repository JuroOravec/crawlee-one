# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 3.x     | Yes       |
| < 3.0   | No        |

## Reporting a vulnerability

If you discover a security vulnerability, please report it privately. **Do not open a public issue.**

Email: [juraj.oravec.josefson@gmail.com](mailto:juraj.oravec.josefson@gmail.com)

Please include:

- A description of the vulnerability
- Steps to reproduce
- Affected versions
- Any potential impact

## Response timeline

- **Acknowledgment**: within 48 hours
- **Initial assessment**: within 1 week
- **Fix or mitigation**: depends on severity, but typically within 2 weeks for critical issues

## What happens after a report

1. The vulnerability is confirmed and assessed for severity.
2. A fix is developed privately (not in a public PR).
3. The fix is released as a patch version.
4. A [GitHub Security Advisory](https://docs.github.com/en/code-security/security-advisories) is published with a CVE ID. This automatically notifies all downstream users via `npm audit` and Dependabot security alerts.
5. The vulnerability is documented in the changelog.
6. Credit is given to the reporter unless they prefer to remain anonymous.

The advisory is published **after** the fix is released, following coordinated disclosure practices. The vulnerability is not disclosed publicly until users have a patched version available.
