import { redirect } from "@sveltejs/kit"
import { authApi } from "src/api/services/auth/authService"
import { userStore } from "src/stores/userStore"
import { tokenService } from "src/utils/config/tokens"
import { get } from "svelte/store"

export const load = async () => {
  let res;
  try {
    res = await authApi.refresh();
    userStore.setUser(res.user);
    tokenService.setAccessToken(res.accessToken);
  } catch {}

  if (!res?.user || !res?.accessToken) return redirect(302, "/login");

  return {};
}