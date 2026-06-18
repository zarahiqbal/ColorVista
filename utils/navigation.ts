import { router } from "expo-router";

/** Reset navigation to the home dashboard, clearing any stacked flows (quiz, games, etc.). */
export function goHome() {
  router.dismissTo("/dashboard");
}

/** Pop one screen when possible; otherwise return to home. */
export function goBackOrHome() {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  goHome();
}
