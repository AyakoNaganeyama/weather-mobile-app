import { useEffect } from "react";
import { useRouter } from "expo-router";
import index from "./(tabs)";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(tabs)/"); // absolute path
  }, []);

  return null; // no UI needed
}
