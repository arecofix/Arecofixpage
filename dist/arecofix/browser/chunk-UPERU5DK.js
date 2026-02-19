import {
  DestroyRef,
  Injector,
  ReplaySubject,
  RuntimeError,
  assertInInjectionContext,
  assertNotInReactiveContext,
  computed,
  effect,
  encapsulateResourceError,
  inject,
  resource,
  signal,
  untracked
} from "./chunk-XQFVERLD.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function toObservable(source, options) {
  if (ngDevMode && !options?.injector) {
    assertInInjectionContext(toObservable);
  }
  const injector = options?.injector ?? inject(Injector);
  const subject = new ReplaySubject(1);
  const watcher = effect(() => {
    let value;
    try {
      value = source();
    } catch (err) {
      untracked(() => subject.error(err));
      return;
    }
    untracked(() => subject.next(value));
  }, {
    injector,
    manualCleanup: true
  });
  injector.get(DestroyRef).onDestroy(() => {
    watcher.destroy();
    subject.complete();
  });
  return subject.asObservable();
}
function toSignal(source, options) {
  typeof ngDevMode !== "undefined" && ngDevMode && assertNotInReactiveContext(toSignal, "Invoking `toSignal` causes new subscriptions every time. Consider moving `toSignal` outside of the reactive context and read the signal value where needed.");
  const requiresCleanup = !options?.manualCleanup;
  if (ngDevMode && requiresCleanup && !options?.injector) {
    assertInInjectionContext(toSignal);
  }
  const cleanupRef = requiresCleanup ? options?.injector?.get(DestroyRef) ?? inject(DestroyRef) : null;
  const equal = makeToSignalEqual(options?.equal);
  let state;
  if (options?.requireSync) {
    state = signal({
      kind: 0
    }, __spreadValues({
      equal
    }, ngDevMode ? createDebugNameObject(options?.debugName, "state") : void 0));
  } else {
    state = signal({
      kind: 1,
      value: options?.initialValue
    }, __spreadValues({
      equal
    }, ngDevMode ? createDebugNameObject(options?.debugName, "state") : void 0));
  }
  let destroyUnregisterFn;
  const sub = source.subscribe({
    next: (value) => state.set({
      kind: 1,
      value
    }),
    error: (error) => {
      state.set({
        kind: 2,
        error
      });
      destroyUnregisterFn?.();
    },
    complete: () => {
      destroyUnregisterFn?.();
    }
  });
  if (options?.requireSync && state().kind === 0) {
    throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
  }
  destroyUnregisterFn = cleanupRef?.onDestroy(sub.unsubscribe.bind(sub));
  return computed(() => {
    const current = state();
    switch (current.kind) {
      case 1:
        return current.value;
      case 2:
        throw current.error;
      case 0:
        throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
    }
  }, __spreadValues({
    equal: options?.equal
  }, ngDevMode ? createDebugNameObject(options?.debugName, "source") : void 0));
}
function makeToSignalEqual(userEquality = Object.is) {
  return (a, b) => a.kind === 1 && b.kind === 1 && userEquality(a.value, b.value);
}
function createDebugNameObject(toSignalDebugName, internalSignalDebugName) {
  return {
    debugName: `toSignal${toSignalDebugName ? "#" + toSignalDebugName : ""}.${internalSignalDebugName}`
  };
}
function rxResource(opts) {
  if (ngDevMode && !opts?.injector) {
    assertInInjectionContext(rxResource);
  }
  return resource(__spreadProps(__spreadValues({}, opts), {
    loader: void 0,
    stream: (params) => {
      let sub;
      const onAbort = () => sub?.unsubscribe();
      params.abortSignal.addEventListener("abort", onAbort);
      const stream = signal({
        value: void 0
      });
      let resolve;
      const promise = new Promise((r) => resolve = r);
      function send(value) {
        stream.set(value);
        resolve?.(stream);
        resolve = void 0;
      }
      const streamFn = opts.stream ?? opts.loader;
      if (streamFn === void 0) {
        throw new RuntimeError(990, ngDevMode && `Must provide \`stream\` option.`);
      }
      sub = streamFn(params).subscribe({
        next: (value) => send({
          value
        }),
        error: (error) => {
          send({
            error: encapsulateResourceError(error)
          });
          params.abortSignal.removeEventListener("abort", onAbort);
        },
        complete: () => {
          if (resolve) {
            send({
              error: new RuntimeError(991, ngDevMode && "Resource completed before producing a value")
            });
          }
          params.abortSignal.removeEventListener("abort", onAbort);
        }
      });
      return promise;
    }
  }));
}

export {
  toObservable,
  toSignal,
  rxResource
};
/*! Bundled license information:

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v21.1.1
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-UPERU5DK.js.map
