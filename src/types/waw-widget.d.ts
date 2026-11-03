declare module 'waw-widget/dist/waw.js' {
  export interface WAWOptions {
    colors?: {
      mainColor?: string;
      secondColor?: string;
    };
  }

  export default class WAW {
    static instance: WAW | null;
    $widget: HTMLElement | null;
    $close_button: HTMLElement | null;
    $open_button: HTMLElement | null;
    widget_open: boolean;
    basePath: string;

    constructor(customConfiguration?: WAWOptions);
    run(): void;
    open(): void;
    close(): void;
    toggleWidget(): void;
    toggleTheme(): void;
    resetFunctions(): void;
    setPosition(positionValue: 'left' | 'right'): void;
    setLeft(): void;
    setRight(): void;
  }
}

declare module 'waw-widget' {
  import WAW from 'waw-widget/dist/waw.js';
  export default WAW;
}

