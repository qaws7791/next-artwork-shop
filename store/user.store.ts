//create firebase user store using zustand

import { User } from "firebase/auth";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  loginUser: (user: User) => set({ user }),
  logoutUser: () => set({ user: null }),
}));

export default useUserStore;
