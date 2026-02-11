type ArrVal<T extends any[] | readonly any[]> = T[number];

export const FIELD_TYPE = ['string', 'array', 'object', 'boolean', 'integer', 'number'] as const;
export type FieldType = ArrVal<typeof FIELD_TYPE>;

export const STRING_EDITOR_TYPE = ['textfield', 'textarea', 'javascript', 'python', 'select', 'datepicker', 'fileupload', 'hidden'] as const; // prettier-ignore
export type StringEditorType = ArrVal<typeof STRING_EDITOR_TYPE>;

export const BOOLEAN_EDITOR_TYPE = ['checkbox', 'hidden'] as const; // prettier-ignore
export type BooleanEditorType = ArrVal<typeof BOOLEAN_EDITOR_TYPE>;

export const INTEGER_EDITOR_TYPE = ['number', 'hidden'] as const; // prettier-ignore
export type IntegerEditorType = ArrVal<typeof INTEGER_EDITOR_TYPE>;

export const NUMBER_EDITOR_TYPE = ['number', 'hidden'] as const; // prettier-ignore
export type NumberEditorType = ArrVal<typeof NUMBER_EDITOR_TYPE>;

export const OBJECT_EDITOR_TYPE = ['json', 'proxy', 'schemaBased', 'hidden'] as const; // prettier-ignore
export type ObjectEditorType = ArrVal<typeof OBJECT_EDITOR_TYPE>;

/** See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#array */
export const ARRAY_EDITOR_TYPE = ['json', 'requestListSources', 'pseudoUrls', 'globs', 'keyValue', 'stringList', 'fileupload', 'select', 'schemaBased', 'hidden'] as const; // prettier-ignore
export type ArrayEditorType = ArrVal<typeof ARRAY_EDITOR_TYPE>;

export const DATE_TYPE = ['absolute', 'relative', 'absoluteOrRelative'] as const;
export type DateType = ArrVal<typeof DATE_TYPE>;

/** See https://docs.apify.com/platform/actors/development/actor-definition/input-schema */
export interface ActorInputSchema<TProps extends Record<string, Field> = Record<string, Field>> {
  /**
   * Any text describing your input schema.
   *
   * Example: `'Cheerio Crawler input'`
   */
  title: string;
  /**
   * Help text for the input that will be displayed above the UI fields.
   */
  description?: string;
  /** This is fixed and must be set to string object. */
  type: 'object';
  /**
   * The version of the specification against which your schema is written.
   * Currently, only version 1 is out.
   */
  schemaVersion: 1;
  /** This is an object mapping each field key to its specification. */
  properties: TProps;
  /** An array of field keys that are required. */
  required?: (keyof TProps)[];
  /**
   * Controls if properties not listed in `properties` are allowed.
   * Defaults to `true`. Set to `false` to make requests with extra
   * properties fail.
   */
  additionalProperties?: boolean;
}

/** See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#input-fields */
export type Field =
  | StringField
  | BooleanField
  | IntegerField
  | NumberField
  | ObjectField
  | ArrayField;

interface BaseField {
  /** Allowed type for the input value. Cannot be mixed. */
  type: FieldType;
  /** Title of the field in UI. */
  title: string;
  /** Description of the field that will be displayed as help text in Actor input UI. */
  description: string;
  /**
   * If this property is set, then all fields following this field
   * (this field included) will be separated into a collapsible section
   * with the value set as its caption. The section ends at the last field
   * or the next field which has the sectionCaption property set.
   */
  sectionCaption?: string;
  /**
   * If the sectionCaption property is set, then you can use this property to
   * provide additional description to the section. The description will be
   * visible right under the caption when the section is open.
   */
  sectionDescription?: string;
  /** Specifies whether null is an allowed value. */
  nullable?: boolean;
  /**
   * Optional validation schema for this field (e.g. a Zod schema).
   *
   * This property is NOT part of the Apify input schema spec and is
   * automatically stripped when generating `actor.json`.
   */
  schema?: any;
}

/**
 * Custom error messages for validation keywords, keyed by the validation
 * keyword name. Each field type supports a different set of keywords.
 *
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/custom-error-messages#supported-validation-keywords
 */
export interface StringErrorMessage {
  type?: string;
  pattern?: string;
  minLength?: string;
  maxLength?: string;
  enum?: string;
}

/** See {@link StringErrorMessage} */
export interface NumericErrorMessage {
  type?: string;
  minimum?: string;
  maximum?: string;
}

/** See {@link StringErrorMessage} */
export interface BooleanErrorMessage {
  type?: string;
}

/** See {@link StringErrorMessage} */
export interface ArrayErrorMessage {
  type?: string;
  minItems?: string;
  maxItems?: string;
  uniqueItems?: string;
  patternKey?: string;
  patternValue?: string;
}

/** See {@link StringErrorMessage} */
export interface ObjectErrorMessage {
  type?: string;
  minProperties?: string;
  maxProperties?: string;
  patternKey?: string;
  patternValue?: string;
}

/**
 * Maps a {@link FieldType} literal to the matching error-message interface.
 *
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/custom-error-messages#supported-validation-keywords
 */
export type ErrorMessageForFieldType<FT extends FieldType> = FT extends 'string'
  ? StringErrorMessage
  : FT extends 'boolean'
    ? BooleanErrorMessage
    : FT extends 'integer' | 'number'
      ? NumericErrorMessage
      : FT extends 'array'
        ? ArrayErrorMessage
        : FT extends 'object'
          ? ObjectErrorMessage
          : never;

/** Value of these fields is dependent on the field type */
interface BaseFieldTypedProps<T, FT extends FieldType = FieldType> {
  /** Default value that will be used when no value is provided. */
  default?: T;
  /**
   * Value that will be prefilled in the actor input interface.
   */
  prefill?: T;
  /**
   * Sample value of this field for the actor to be displayed when
   * actor is published in Apify Store.
   */
  example?: T;
  /**
   * Custom error messages for validation keywords.
   * The allowed keys depend on the field's `type`.
   *
   * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/custom-error-messages
   */
  errorMessage?: ErrorMessageForFieldType<FT>;
}

/**
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#string
 *
 * Example of code input:
 *
 * ```json
 * {
 * "title": "Page function",
 * "type": "string",
 * "description": "Function executed for each request",
 * "editor": "javascript",
 * "prefill": "async () => { return $('title').text(); }",
 * }
 * ```
 *
 * Example of country selection using a select input:
 *
 * ```json
 * {
 * "title": "Country",
 * "type": "string",
 * "description": "Select your country",
 * "editor": "select",
 * "default": "us",
 * "enum": ["us", "de", "fr"],
 * "enumTitles": ["USA", "Germany", "France"]
 * }
 * ```
 */
export type StringField<TEnum extends string = string, TEnumTitles extends string = string> =
  | SelectStringField<TEnum, TEnumTitles>
  | TextStringField<TEnum>
  | DatePickerStringField<TEnum>
  | BaseStringField<TEnum>;

interface BaseStringField<TEnum extends string = string>
  extends BaseField, BaseFieldTypedProps<TEnum, 'string'> {
  type: 'string';
  /** Visual editor used for the input field. */
  editor: Exclude<StringEditorType, 'select' | 'textfield' | 'textarea' | 'datepicker'>;
  /**
   * Regular expression that will be used to validate the input.
   * If validation fails, the actor will not run.
   *
   * NOTE: When using escape characters `\` for the regular expression
   * in the pattern field, be sure to escape them to avoid invalid
   * JSON issues. For example, the regular expression
   *
   * `https:\/\/(www\.)?apify\.com\/.+`
   *
   * would become
   *
   * `https:\\/\\/(www\\.)?apify\\.com\\/.+`
   */
  pattern?: string;
  /** Minimum length of the string. */
  minLength?: number;
  /** Maximum length of the string. */
  maxLength?: number;
  /**
   * Specifies whether the input field will be stored encrypted.
   * Only available with textfield, textarea, and hidden editors.
   */
  isSecret?: boolean;
}

interface SelectStringField<TEnum extends string = string, TEnumTitles extends string = string>
  extends Omit<BaseStringField<TEnum>, 'editor'>, BaseFieldTypedProps<TEnum, 'string'> {
  editor: 'select';
  /**
   * Using this field, you can limit values
   * to the given array of strings.
   * Input will be displayed as select box.
   * Values are strictly validated against this list.
   */
  enum?: TEnum[] | readonly TEnum[];
  /**
   * Similar to `enum`, but only suggests values in the UI without
   * enforcing validation. Users can select from the dropdown or enter
   * a custom value. Works only with the `select` editor.
   */
  enumSuggestedValues?: TEnum[] | readonly TEnum[];
  /** Titles for the enum keys described. */
  enumTitles?: TEnumTitles[] | readonly TEnumTitles[];
}

interface TextStringField<TEnum extends string = string> extends Omit<
  BaseStringField<TEnum>,
  'editor'
> {
  editor: 'textfield' | 'textarea';
  /**
   * Specifies whether the input field will be stored encrypted.
   * Only available with textfield, textarea, and hidden editors.
   */
  isSecret?: boolean;
}

/**
 * String field with the `datepicker` editor.
 *
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#date-picker
 */
interface DatePickerStringField<TEnum extends string = string> extends Omit<
  BaseStringField<TEnum>,
  'editor'
> {
  editor: 'datepicker';
  /**
   * Specifies what date format the visual editor should accept.
   *
   * - `'absolute'` - date input in `YYYY-MM-DD` format (default).
   * - `'relative'` - relative date in `{number} {unit}` format
   *   (e.g. "3 weeks"). Supported units: days, weeks, months, years.
   * - `'absoluteOrRelative'` - both formats; user can switch between them.
   *
   * Defaults to `'absolute'`.
   */
  dateType?: DateType;
}

/**
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#boolean-type
 *
 * Example options with group caption:
 *
 * ```json
 * {
 * "title": "Verbose log",
 * "type": "boolean",
 * "description": "Debug messages will be included in the log.",
 * "default": true,
 * "groupCaption": "Options",
 * "groupDescription": "Various options for this actor"
 * },
 * {
 * "title": "Lightspeed",
 * "type": "boolean",
 * "description": "If checked then actors runs at the speed of light.",
 * "prefill": true
 * }
 * ```
 */
export interface BooleanField<T extends boolean = boolean>
  extends BaseField, BaseFieldTypedProps<T, 'boolean'> {
  type: 'boolean';
  /** Visual editor used for the input field. */
  editor?: BooleanEditorType;
  /**
   * If you want to group multiple checkboxes together,
   * add this option to the first of the group.
   */
  groupCaption?: string;
  /** Description displayed as help text displayed of group title. */
  groupDescription?: string;
}

/**
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#numeric-types
 *
 * Example:
 *
 * ```json
 * {
 * "title": "Memory",
 * "type": "integer",
 * "description": "Select memory in megabytes",
 * "default": 64,
 * "maximum": 1024,
 * "unit": "MB"
 * }
 * ```
 */
export interface IntegerField<T extends number = number, TUnit extends string = string>
  extends BaseField, BaseFieldTypedProps<T, 'integer'> {
  type: 'integer';
  /** Visual editor used for the input field. */
  editor?: IntegerEditorType;
  /** Maximum allowed value. */
  maximum?: number;
  /** Minimum allowed value. */
  minimum?: number;
  /** Unit displayed next to the field in UI, for example second, MB, etc. */
  unit?: TUnit;
}

/**
 * Floating-point number field. Unlike `IntegerField`, this accepts
 * both integers and decimal numbers.
 *
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#numeric-types
 *
 * Example:
 *
 * ```json
 * {
 * "title": "Temperature",
 * "type": "number",
 * "description": "Target temperature in Celsius",
 * "default": 36.6,
 * "minimum": 0,
 * "maximum": 100,
 * "unit": "°C"
 * }
 * ```
 */
export interface NumberField<T extends number = number, TUnit extends string = string>
  extends BaseField, BaseFieldTypedProps<T, 'number'> {
  type: 'number';
  /** Visual editor used for the input field. */
  editor?: NumberEditorType;
  /** Maximum allowed value. */
  maximum?: number;
  /** Minimum allowed value. */
  minimum?: number;
  /** Unit displayed next to the field in UI, for example second, MB, etc. */
  unit?: TUnit;
}

/**
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#object-type
 *
 * Example of proxy configuration:
 *
 * ```json
 * {
 * "title": "Proxy configuration",
 * "type": "object",
 * "description": "Select proxies to be used by your crawler.",
 * "prefill": { "useApifyProxy": true },
 * "editor": "proxy"
 * }
 * ```
 *
 * Example of a blackbox object:
 *
 * ```json
 * {
 * "title": "User object",
 * "type": "object",
 * "description": "Enter object representing user",
 * "prefill": {
 * "name": "John Doe",
 * "email": "janedoe@gmail.com"
 * },
 * "editor": "json"
 * }
 * ```
 */
export interface ObjectField<T extends object = object>
  extends BaseField, BaseFieldTypedProps<T, 'object'> {
  type: 'object';
  /** Visual editor used for the input field. */
  editor: ObjectEditorType;
  /** Regular expression that will be used to validate the keys of the object. */
  patternKey?: string;
  /** Regular expression that will be used to validate the values of object. */
  patternValue?: string;
  /** Maximum number of properties the object can have. */
  maxProperties?: number;
  /** Minimum number of properties the object can have. */
  minProperties?: number;
  /**
   * Specifies whether the input field will be stored encrypted.
   * Only available with `json` and `hidden` editors.
   */
  isSecret?: boolean;
  /**
   * Defines the sub-schema properties for the object, used for validation
   * and UI rendering with the `schemaBased` editor. Each sub-property can
   * define the same fields as root-level input fields, except for
   * `sectionCaption` and `sectionDescription`.
   *
   * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#object-fields-validation
   */
  properties?: Record<string, Field>;
  /**
   * Controls if sub-properties not listed in `properties` are allowed.
   * Defaults to `true`. Set to `false` to make requests with extra
   * properties fail.
   */
  additionalProperties?: boolean;
  /**
   * An array of sub-property keys that are required.
   * Note: This applies only if the object field itself is present.
   * If the object field is optional and not included in the input,
   * its required subfields are not validated.
   */
  required?: string[];
}

/**
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#array
 *
 * Usage of this field is based on the selected editor:
 * - `requestListSources` - value from this field can be used as input of RequestList class from Crawlee.
 * - `pseudoUrls` - is intended to be used with a combination of the PseudoUrl class and the enqueueLinks() function from Crawlee.
 *
 * Example of request list sources configuration:
 *
 * ```json
 * {
 * "title": "Start URLs",
 * "type": "array",
 * "description": "URLs to start with",
 * "prefill": [{ "url": "http://example.com" }],
 * "editor": "requestListSources"
 * }
 * ```
 *
 * Example of an array:
 *
 * ```json
 * {
 * "title": "Colors",
 * "type": "array",
 * "description": "Enter colors you know",
 * "prefill": ["Red", "White"],
 * "editor": "json"
 * }
 * ```
 */
export type ArrayField<T = unknown> =
  | BaseArrayField<T>
  | KeyValueArrayField<T>
  | StringListArrayField<T>
  | SelectArrayField<T>;

interface BaseArrayField<T = unknown> extends BaseField, BaseFieldTypedProps<T, 'array'> {
  type: 'array';
  /** Visual editor used for the input field. */
  editor: Exclude<ArrayEditorType, 'keyValue' | 'stringList' | 'select'>;
  /** Maximum number of items the array can contain. */
  maxItems?: number;
  /** Minimum number of items the array can contain. */
  minItems?: number;
  /** Specifies whether the array should contain only unique values. */
  uniqueItems?: boolean;
  /**
   * Specifies whether the input field will be stored encrypted.
   * Only available with `json` and `hidden` editors.
   */
  isSecret?: boolean;
  /**
   * Specifies format of the items of the array. Useful mainly for
   * multiselect (`select` editor) and for the `schemaBased` editor.
   */
  items?: object;
}

interface KeyValueOrStringListArrayFieldProps {
  /**
   * Placeholder displayed in value field when no value is provided.
   * Works only with `keyValue` and `stringList` editors.
   */
  placeholderValue?: string;
  /**
   * Regular expression that will be used to validate the values
   * of items in the array. Works only with `keyValue` and `stringList` editors.
   */
  patternValue?: string;
}

interface StringListArrayField<T = unknown>
  extends Omit<BaseArrayField<T>, 'editor'>, KeyValueOrStringListArrayFieldProps {
  editor: 'stringList';
}

interface KeyValueArrayField<T = unknown>
  extends Omit<BaseArrayField<T>, 'editor'>, KeyValueOrStringListArrayFieldProps {
  editor: 'keyValue';
  /**
   * Placeholder displayed for key field when no value is specified.
   * Works only with `keyValue` editor.
   */
  placeholderKey?: string;
  /**
   * Regular expression that will be used to validate
   * the keys of items in the array.
   * Works only with `keyValue` editor.
   */
  patternKey?: string;
}

/**
 * Array field with `select` editor for multiselect dropdowns.
 *
 * See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#select-editor-for-arrays
 */
interface SelectArrayField<T = unknown> extends Omit<BaseArrayField<T>, 'editor'> {
  editor: 'select';
  /**
   * Specifies format of the items of the array. For multiselect,
   * define `enum` or `enumSuggestedValues` and optionally `enumTitles`
   * inside the `items` object.
   */
  items?: {
    type?: string;
    /** Predefined values for multiselect. */
    enum?: string[];
    /** Suggested values that don't enforce validation. */
    enumSuggestedValues?: string[];
    /** Display titles for enum values. */
    enumTitles?: string[];
  };
}

export const createActorInputSchema = <T extends ActorInputSchema<Record<string, Field>>>(
  config: T
) => config;
export const createStringField = <T extends string = string, U extends string = string>(field: StringField<T, U>) => field; // prettier-ignore
export const createBooleanField = <T extends boolean = boolean>(field: BooleanField<T>) => field; // prettier-ignore
export const createIntegerField = <T extends number = number, U extends string = string>(field: IntegerField<T, U>) => field; // prettier-ignore
export const createNumberField = <T extends number = number, U extends string = string>(field: NumberField<T, U>) => field; // prettier-ignore
export const createObjectField = <T extends object = object>(field: ObjectField<T>) => field; // prettier-ignore
export const createArrayField = <T = unknown>(field: ArrayField<T>) => field; // prettier-ignore
