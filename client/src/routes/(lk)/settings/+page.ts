import { redirect } from "@sveltejs/kit";
import { userStore } from "src/stores/userStore";
import { get } from "svelte/store";

export const load = async ({parent}) => {
  await parent()
}