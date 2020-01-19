/** Defines the shape of a JSON value. */
export declare type Json = null | boolean | number | string | Json[] | {
    [property: string]: Json;
};
/** Defines the shape of an object in JSON format. */
export declare type JsonObject = Record<string, Json>;
/** Defines the shape of a map whose values are strings. */
export declare type StringMap = Record<string, string | undefined>;
