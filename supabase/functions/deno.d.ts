declare namespace Deno {
  export var env: {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): { [key: string]: string };
  };
  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
}
