import type { DependencyList } from "react";
import { useFocusedBackHandler } from "./useBackNavigation";

/**
 * @deprecated Prefer the focused helpers in `useBackNavigation.ts`.
 * Kept for compatibility — only runs while the screen is focused.
 */
export function useScreenBackHandler(
  handler: () => boolean,
  deps: DependencyList = [],
) {
  useFocusedBackHandler(handler, deps);
}
