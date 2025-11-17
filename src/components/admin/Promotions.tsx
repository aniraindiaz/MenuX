import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PromotionForm {
  title: string;
  description: string;
  audience: string;
  active: boolean;
}

export const PromotionsAdmin = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PromotionForm>({ title: "", description: "", audience: "", active: true });

  const { data: promotions = [] } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) return [] as any[];
      return data ?? [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: PromotionForm) => {
      const { error } = await supabase.from("promotions").insert({
        title: payload.title,
        description: payload.description || null,
        audience: payload.audience || null,
        active: payload.active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      setForm({ title: "", description: "", audience: "", active: true });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("promotions")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Promotions</h2>
      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-title">Title</Label>
              <Input
                id="promo-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g., Cocktail & Mocktail at 99"
              />
            </div>
            <div>
              <Label htmlFor="promo-audience">Audience</Label>
              <Input
                id="promo-audience"
                value={form.audience}
                onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
                placeholder="e.g., Ladies"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="promo-active"
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
              <Label htmlFor="promo-active">Active</Label>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="promo-desc">Description</Label>
              <Input
                id="promo-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description"
              />
            </div>
          </div>
          <Button onClick={() => addMutation.mutate(form)} disabled={!form.title.trim()}>
            Add Promotion
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              addMutation.mutate({
                title: "Free Drinks for Ladies",
                description: "Complimentary select drinks for ladies tonight",
                audience: "Ladies",
                active: true,
              })
            }
          >
            Add Ladies Night Offer
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {promotions.map((p: any) => (
          <Card key={p.id} className="bg-card/60">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {p.title}
                  {p.audience && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 px-2 py-0.5 text-xs text-white">
                      {p.audience}
                    </span>
                  )}
                </p>
                {p.description && (
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={p.active} onCheckedChange={(checked) => toggleActive.mutate({ id: p.id, active: checked })} />
                <Button variant="destructive" onClick={() => removeMutation.mutate(p.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {promotions.length === 0 && (
          <p className="text-muted-foreground">No promotions yet.</p>
        )}
      </div>
    </section>
  );
};