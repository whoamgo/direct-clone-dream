import { useAppSelector } from "@/hooks/useAppSelector";
import { selectGlobalLoading } from "@/store/selectors";

export const GlobalLoader = () => {
  const loading = useAppSelector(selectGlobalLoading);
  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center"
      style={{ zIndex: "var(--z-max)" }}
    >
      <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
    </div>
  );
};
