import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { appWindow } from "@tauri-apps/api/window";

export async function useMediaQuery(minWindowSize: number) {
  const { data: windowSize, refetch } = useQuery<number>({
    queryKey: ["windowSize"],
    queryFn: async () => {
      if (!appWindow) return 0;
      const { width } = await appWindow.innerSize();
      return width;
    },
  });
  useEffect(() => {
    if (!appWindow) return;
    appWindow.listen("tauri://resize", async () => {
      refetch();
    });
  }, []);

  return windowSize ? windowSize > minWindowSize : false;
}
