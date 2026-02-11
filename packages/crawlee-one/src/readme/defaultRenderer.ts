import type { ReadmeRenderer } from '../types/config.js';

/**
 * Input for {@link defaultReadmeRenderer}.
 *
 * All fields are optional -- the renderer produces whatever sections have data.
 */
export interface DefaultReadmeInput {
  /** Introductory paragraph shown after the title. */
  intro?: string;
  /** Use-case bullet points or paragraphs. */
  useCases?: string;
  /** Section describing input / configuration. */
  inputDescription?: string;
  /** Section describing the output / dataset shape. */
  outputDescription?: string;
  /** Performance / cost notes. */
  performance?: string;
  /** Additional sections appended at the end. */
  extra?: string;
}

/**
 * A general-purpose README renderer shipped with crawlee-one.
 *
 * Produces a clean Markdown README from the actor spec and optional input
 * sections. This renderer is framework-agnostic and does not depend on any
 * template engine.
 */
export const defaultReadmeRenderer: ReadmeRenderer<DefaultReadmeInput> = (args) => {
  const { actorSpec, input } = args;
  const spec = actorSpec as Record<string, any> | undefined;
  const t = input ?? ({} as DefaultReadmeInput);

  const title = spec?.actor?.title ?? spec?.name ?? 'Untitled';
  const description = spec?.actor?.shortDesc ?? '';

  const sections: string[] = [];

  // Title
  sections.push(`# ${title}`);
  if (description) {
    sections.push(description);
  }

  // Intro
  if (t.intro) {
    sections.push(t.intro);
  }

  // Use cases
  if (t.useCases) {
    sections.push(`## Use cases\n\n${t.useCases}`);
  }

  // Input
  if (t.inputDescription) {
    sections.push(`## Input\n\n${t.inputDescription}`);
  }

  // Output
  if (t.outputDescription) {
    sections.push(`## Output\n\n${t.outputDescription}`);
  }

  // Performance
  if (t.performance) {
    sections.push(`## Performance\n\n${t.performance}`);
  }

  // Extra
  if (t.extra) {
    sections.push(t.extra);
  }

  return sections.join('\n\n') + '\n';
};
