// Reduxで管理できないシリアライズ不可な値をシンプルに持つストア

interface UnmanagedStore {
  installPromptEvent: BeforeInstallPromptEvent | null;
}

const store: UnmanagedStore = {
  installPromptEvent: null,
};

export default store;
