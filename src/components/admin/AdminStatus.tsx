import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export const AdminStatus = () => {
  const { data: counts, isLoading } = useQuery({
    queryKey: ["admin-status-counts"],
    queryFn: async () => {
      const menu = await supabase.from("menu_items").select("id", { count: "exact", head: true });
      const settings = await supabase.from("restaurant_settings").select("id", { count: "exact", head: true });
      return {
        menu: menu.count ?? 0,
        settings: settings.count ?? 0,
        connected: !menu.error && !settings.error,
      };
    },
    staleTime: 60 * 1000,
  });

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        ) : counts ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Connection</p>
              <p className={counts.connected ? "text-green-400" : "text-red-400"}>{counts.connected ? "Connected" : "Error"}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Menu Items</p>
              <p className="text-foreground font-semibold">{counts.menu}</p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};