/**
 * Type declarations for Error.captureStackTrace
 * This is a V8-specific feature not in standard TypeScript
 */
declare global {
    interface ErrorConstructor {
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    }
}

export { };
