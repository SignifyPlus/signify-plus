import { create, StoreApi, UseBoundStore } from "zustand";

interface AppState {
  videoCallPhoneNumber: string | undefined;
  startVideoCall: (phoneNumber: string) => void;
  endVideoCall: () => void;
}

const store = create<AppState>()((set) => ({
  videoCallPhoneNumber: undefined,
  startVideoCall: (phoneNumber) => set({ videoCallPhoneNumber: phoneNumber }),
  endVideoCall: () => set({ videoCallPhoneNumber: undefined }),
}));

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const useAppStore = createSelectors(store);
