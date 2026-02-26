import { program } from 'commander';

import { getPackageJsonInfo } from '../utils/package.js';
import { createDevCommand } from './commands/dev.js';
import { createExpectationsCommand } from './commands/expectations.js';
import { createExportCommand } from './commands/export.js';
import { createGenerateCommand } from './commands/generate.js';
import { createLlmCommand } from './commands/llm.js';
import { createPreviewCommand } from './commands/preview.js';
import { createRunCommand } from './commands/run.js';
import { createValidateCommand } from './commands/validate.js';

const pkgJson = getPackageJsonInfo(import.meta.url, ['name', 'version']);

program //
  .name(pkgJson.name)
  .description('CLI to run crawlee-one tools')
  .version(pkgJson.version)
  .addCommand(createGenerateCommand())
  .addCommand(createDevCommand())
  .addCommand(createRunCommand())
  .addCommand(createExportCommand())
  .addCommand(createValidateCommand())
  .addCommand(createPreviewCommand())
  .addCommand(createLlmCommand())
  .addCommand(createExpectationsCommand());

export const cli = () => {
  program.parse();
};
