type ArrVal<T extends any[] | readonly any[]> = T[number];

export const VIEW_DISPLAY_PROPERTY_TYPE = ['text', 'number', 'date', 'link', 'boolean', 'image', 'array', 'object'] as const; // prettier-ignore
export type ViewDisplayPropertyType = ArrVal<typeof VIEW_DISPLAY_PROPERTY_TYPE>;

/**
 * See https://docs.apify.com/platform/actors/development/output-schema
 *
 * Example
 *
 * ```json
 * {
 * "actorSpecification": 1,
 * "fields": {},
 * "views": {
 * "overview": {
 * "title": "Overview",
 * "transformation": {},
 * "display": {}
 * }
 * }
 * ```
 * */
export interface ActorOutputSchema<
  TFields extends object = object,
  TViews extends Record<string, DatasetView> = Record<string, DatasetView>,
> {
  /**
   * The version of the specification against which your schema is written.
   * Currently, only version 1 is out.
   */
  actorSpecification: 1;
  /**
   * Schema of one dataset object. Use JsonSchema Draft 2020-12
   * or other compatible formats.
   */
  fields: TFields;
  /** An object with a description of an API and UI views. */
  views: TViews;
}

/** See https://docs.apify.com/platform/actors/development/output-schema#datasetview-object-definition */
export interface DatasetView<
  TTransform extends ViewTransformation = ViewTransformation,
  TViewDisplay extends ViewDisplay = ViewDisplay,
> {
  /** The title is visible in UI in the Output tab as well as in the API. */
  title: string;
  /**
   * The description is only available in the API response.
   * The usage of this field is optional.
   */
  description?: string;
  /**
   * The definition of data transformation is applied when dataset
   * data are loaded from Dataset API.
   */
  transformation: TTransform;
  /** The definition of Output tab UI visualization. */
  display: TViewDisplay;
}

/** See https://docs.apify.com/platform/actors/development/output-schema#viewtransformation-object-definition */
export interface ViewTransformation<TFields extends string = string> {
  /**
   * Selects fields that are going to be presented in the output.
   * The order of fields matches the order of columns
   * in visualization UI. In case the fields value
   * is missing, it will be presented as "undefined" in the UI.
   */
  fields: (TFields | string)[];
  /**
   * Deconstructs nested children into parent object,
   * e.g. with
   *
   * `unwind: ["foo"]`
   *
   * the object
   *
   * `{"foo": { "bar": "hello" }}`
   *
   * is turned into
   *
   * `{ "bar": "hello" }`
   */
  unwind?: TFields[];
  /**
   * Transforms nested object into flat structure.
   * e.g. with
   *
   * `flatten: ["foo"]`
   *
   * the object
   *
   * `{ "foo": { "bar": "hello" } }`
   *
   * is turned into
   *
   * `{ "foo.bar": "hello" }
   */
  flatten?: TFields[];
  /**
   * Removes the specified fields from the output.
   * Nested fields names can be used there as well.
   */
  omit?: (TFields | string)[];
  /**
   * The maximum number of results returned.
   * Default is all results.
   */
  limit?: number;
  /**
   * By default, results are sorted in ascending based
   * on the write event into the dataset. `desc: true` param
   * will return the newest writes to the dataset first.
   */
  desc?: boolean;
}

/** See https://docs.apify.com/platform/actors/development/output-schema#viewdisplay-object-definition */
export interface ViewDisplay<TFields extends string = string> {
  /** Only component "table" is available. */
  component: 'table';
  /**
   * Object with keys matching the transformation.fields
   * and ViewDisplayProperty as values. In case properties are not set
   * the table will be rendered automatically with fields formatted
   * as Strings, Arrays or Objects.
   */
  properties?: Record<TFields | string, ViewDisplayProperty>;
}

/** See https://docs.apify.com/platform/actors/development/output-schema#viewdisplayproperty-object-definition */
export interface ViewDisplayProperty {
  /**
   * In case the data are visualized as in Table view.
   * The label will be visible table column's header.
   */
  label?: string;
  /**
   * Describes how output data values are formatted
   * in order to be rendered in the output tab UI.
   */
  format?: ViewDisplayPropertyType;
}

export const createActorOutputSchema = <T extends ActorOutputSchema>(config: T) => config;
