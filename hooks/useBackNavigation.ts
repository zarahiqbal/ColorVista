import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, type DependencyList } from "react";
import { Alert, BackHandler } from "react-native";
import { goBackOrHome, goHome } from "@/utils/navigation";

/** Registers a back handler only while this screen is focused. */
export function useFocusedBackHandler(
  handler: () => boolean,
  deps: DependencyList = [],
) {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handler,
      );
      return () => subscription.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps),
  );
}

/** Home tab: confirm before quitting the app. */
export function useExitAppOnBack() {
  useFocusedBackHandler(() => {
    Alert.alert(
      "Exit App",
      "Are you sure you want to quit Color Vista?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Quit", onPress: () => BackHandler.exitApp() },
      ],
    );
    return true;
  }, []);
}

/** Profile / settings tabs: return to home without exiting. */
export function useGoToDashboardOnBack() {
  const router = useRouter();

  useFocusedBackHandler(() => {
    router.replace("/dashboard");
    return true;
  }, [router]);
}

/** Feature screens opened from home: go back one step or reset to home. */
export function useGoBackOrHomeOnBack() {
  useFocusedBackHandler(() => {
    goBackOrHome();
    return true;
  }, []);
}

/** Always reset to home (clears polluted stacks). */
export function useGoHomeOnBack() {
  useFocusedBackHandler(() => {
    goHome();
    return true;
  }, []);
}

/** Navigate to a specific route on back (quiz flow steps). */
export function useNavigateToOnBack(route: string) {
  const router = useRouter();

  useFocusedBackHandler(() => {
    router.dismissTo(route as never);
    return true;
  }, [router, route]);
}

/** Active quiz: confirm before returning to the level screen. */
export function useConfirmLeaveQuizOnBack() {
  const router = useRouter();

  useFocusedBackHandler(() => {
    Alert.alert(
      "Leave Quiz?",
      "Your progress will be lost if you leave now.",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => router.dismissTo("/difficulty"),
        },
      ],
    );
    return true;
  }, [router]);
}
