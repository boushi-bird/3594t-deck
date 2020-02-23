// エラー回避のため: Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.
export {};

declare global {
  interface Window {
    __noticeEnabled: boolean | undefined;
  }

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;

    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;

    prompt(): Promise<void>;
  }
}
