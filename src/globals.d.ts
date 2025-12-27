// Global type declarations for third-party libraries

interface UnicornStudio {
  isInitialized: boolean;
  init: () => void;
}

interface TradingViewWidget {
  new (config: any): any;
}

interface Window {
  UnicornStudio?: UnicornStudio;
  TradingView?: {
    widget: TradingViewWidget;
  };
}

declare const UnicornStudio: UnicornStudio;

