import { redirect } from "@sveltejs/kit"
import { authApi } from "src/api/services/auth/authService"
import { userStore } from "src/stores/userStore"
import { tokenService } from "src/utils/config/tokens"
import { get } from "svelte/store"

export const load = async () => {
  try {
    const res = await authApi.refresh();
    userStore.setUser(res.user);
    tokenService.setAccessToken(res.accessToken);
  } catch {}

  if (!get(userStore.user)) redirect(302, "/login");

  return {};
}