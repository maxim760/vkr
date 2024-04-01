import type   { IUser } from "src/api/types/models/User"
import { writable } from "svelte/store"

const makeUserStore = () => {
  const user = writable<null | IUser>(null);

  return {
    user,
    setUser: (data: null | IUser) => user.set(data),
    clearUser: () => user.set(null),
  }
};

export const userStore = makeUserStore();