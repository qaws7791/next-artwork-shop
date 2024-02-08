//create firebase user store using zustand

import { User } from "firebase/auth";
import { create } from "zustand";

interface UserStore {
  user: User | null | undefined;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  loginUser: (user: User) => set({ user }),
  logoutUser: () => set({ user: null }),
}));

export default useUserStore;
