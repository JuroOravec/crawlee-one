# Contributing to CrawleeOne

Thanks for your interest in contributing! Here's how you can help.

## Reporting bugs

Found a bug? Please [open an issue](https://github.com/jurooravec/crawlee-one/issues) with:

- A clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Node.js version and OS

## Proposing features

Have an idea? [Open an issue](https://github.com/jurooravec/crawlee-one/issues) describing:

- The use case / problem it solves
- How you'd expect the API to look
- Whether you're willing to implement it

## Development setup

```sh
# Clone the repo
git clone https://github.com/jurooravec/crawlee-one.git
cd crawlee-one

# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build
npm run build
```

## Submitting a pull request

1. Fork the repository
2. Create a feature branch (`git checkout -b my-feature`)
3. Make your changes
4. Run `npm test` and `npm run lint` to make sure everything passes
5. Commit your changes with a clear message
6. Push to your fork and open a pull request

## Code style

This project uses ESLint and Prettier for code formatting. Both are configured in the repo -- just run `npm run lint:fix` to auto-format before committing.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
