/**
 * A list of image asset URLs for attribution.
 * 
 * Attribution URLs of image assets are partial.
 * Append the partial URL to `https://weatherkit.apple.com`
 * to obtain the image asset.
 */
export interface Attribution {
    /**
     * The partial URL of the dark appearance of the Apple Weather logo with a scale factor of 1, or @1x.
     */
    readonly "logoDark@1x": string;

    /**
     * The partial URL of the dark appearance of the Apple Weather logo with a scale factor of 2, or @2x.
     */
    readonly "logoDark@2x": string;

    /**
     * The partial URL of the dark appearance of the Apple Weather logo with a scale factor of 3, or @3x.
     */
    readonly "logoDark@3x": string;

    /**
     * The partial URL of the light appearance of the Apple Weather logo with a scale factor of 1, or @1x.
     */
    readonly "logoLight@1x": string;

    /**
     * The partial URL of the light appearance of the Apple Weather logo with a scale factor of 2, or @2x.
     */
    readonly "logoLight@2x": string;

    /**
     * The partial URL of the light appearance of the Apple Weather logo with a scale factor of 3, or @3x.
     */
    readonly "logoLight@3x": string;

    /**
     * The partial URL of a square weather logo with a scale factor of 1, or @1x.
     */
    readonly "logoSquare@1x": string;

    /**
     * The partial URL of a square weather logo with a scale factor of 2, or @2x.
     */
    readonly "logoSquare@2x": string;

    /**
     * The partial URL of a square weather logo with a scale factor of 3, or @3x.
     */
    readonly "logoSquare@3x": string;

    /**
     * The name of the service.
     */
    readonly serviceName: string;
}
