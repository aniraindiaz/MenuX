import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  description: string | null;
  available: boolean;
}

export const MenuItemsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedSection, setSelectedSection] = useState("All Items");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image_url: "",
    description: "",
    available: true,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["admin-menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category")
        .order("name");
      
      if (error) throw error;
      return data as MenuItem[];
    },
  });
  const beverageKeywords = [
    "drink",
    "beverage",
    "juice",
    "tea",
    "coffee",
    "soda",
    "mocktail",
    "cocktail",
    "water",
    "shake",
    "smoothie",
    "lassi",
    "beer",
    "wine"
  ];

  const isDrink = (category: string) => {
    const c = category.toLowerCase();
    return beverageKeywords.some(k => c.includes(k));
  };

  const filteredItems =
    selectedSection === "All Items"
      ? menuItems
      : selectedSection === "Drinks"
      ? menuItems.filter(item => isDrink(item.category))
      : menuItems.filter(item => !isDrink(item.category));

  const createMutation = useMutation({
    mutationFn: async (values: typeof formData) => {
      const { error } = await supabase
        .from("menu_items")
        .insert([{
          name: values.name,
          category: values.category,
          price: parseFloat(values.price),
          image_url: values.image_url || null,
          description: values.description || null,
          available: values.available,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast({ title: "Success", description: "Menu item created successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: typeof formData }) => {
      const { error } = await supabase
        .from("menu_items")
        .update({
          name: values.name,
          category: values.category,
          price: parseFloat(values.price),
          image_url: values.image_url || null,
          description: values.description || null,
          available: values.available,
        })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast({ title: "Success", description: "Menu item updated successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast({ title: "Success", description: "Menu item deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleAvailability = useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const { error } = await supabase
        .from("menu_items")
        .update({ available })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      image_url: "",
      description: "",
      available: true,
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, values: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      image_url: item.image_url || "",
      description: item.description || "",
      available: item.available,
    });
    setIsOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Add, edit, or remove items from your menu</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL (optional)</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedSection} onValueChange={setSelectedSection} className="mb-4">
          <TabsList className="w-full h-12 rounded-2xl border border-border bg-card/30 p-1 flex">
            {(["All Items", "Drinks", "Food"] as const).map((section) => (
              <TabsTrigger
                key={section}
                value={section}
                className={
                  "flex-1 rounded-xl text-sm font-semibold data-[state=active]:text-white " +
                  (section === "Drinks"
                    ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-pink-500"
                    : section === "Food"
                    ? "data-[state=active]:bg-card data-[state=active]:text-primary"
                    : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground")
                }
              >
                {section} (
                  {section === "All Items"
                    ? menuItems.length
                    : section === "Drinks"
                    ? menuItems.filter(i => isDrink(i.category)).length
                    : menuItems.filter(i => !isDrink(i.category)).length}
                )
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.available}
                        onCheckedChange={(checked) => toggleAvailability.mutate({ id: item.id, available: checked })}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this item?")) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
