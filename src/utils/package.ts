import pkginfo from 'pkginfo';

/**
 * `pkginfo` is an npm package that finds closest package.json
 * and returns only the fields that we request. While it works
 * well, the usage is strange. Hence we wrap it to contain the magic.
 *
 * See https://www.npmjs.com/package/pkginfo
 * */
export const getPackageJsonInfo = <TFields extends string = string>(
  filenameOrModule:
    | { filename: string; id?: string }
    | { id: string; filename?: string }
    | NodeModule,
  fields: TFields[]
) => {
  const obj = {
    filename: filenameOrModule?.filename,
    id: filenameOrModule?.id,
    exports: {}, // This is where the fields will be written
  };
  pkginfo(obj as any, { include: fields });
  return obj.exports as Record<TFields, any>;
};
