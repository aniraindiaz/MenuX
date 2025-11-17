import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  description: string | null;
  available: boolean;
}

const Menu = () => {
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id,name,category,price,image_url,description,available")
        .eq("available", true)
        .order("name");
      
      if (error) throw error;
      return data as MenuItem[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: settings } = useQuery({
    queryKey: ["restaurant-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
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

  const sectionFilteredItems = useMemo(() => {
    if (selectedSection === "All") return menuItems;
    if (selectedSection === "DRINKS") return menuItems.filter(item => isDrink(item.category));
    return menuItems.filter(item => !isDrink(item.category));
  }, [selectedSection, menuItems]);

  const categories = useMemo(() => [
    "All",
    ...Array.from(new Set(sectionFilteredItems.map(item => item.category)))
  ], [sectionFilteredItems]);

  const filteredItems = useMemo(() => (
    selectedCategory === "All"
      ? sectionFilteredItems
      : sectionFilteredItems.filter(item => item.category === selectedCategory)
  ), [selectedCategory, sectionFilteredItems]);

  const groupedItems = useMemo(() => filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>), [filteredItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-2/3 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{settings?.restaurant_name || "Menu"}</h1>
            <a href="https://menu.search.help" className="text-sm text-primary hover:underline">
              menu.search.help
            </a>
          </div>
        </div>
      </header>

      {/* Section Tabs */}
      <div className="sticky top-[73px] z-10 bg-background border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={selectedSection} onValueChange={setSelectedSection} className="w-full">
            <TabsList className="w-full h-16 rounded-2xl border border-border bg-card/30 p-1 flex">
              {(["DRINKS", "FOOD"] as const).map((section, idx) => (
                <TabsTrigger
                  key={section}
                  value={section}
                  className={
                    "flex-1 rounded-xl text-lg font-bold " +
                    "data-[state=active]:text-white " +
                    (section === "DRINKS"
                      ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-pink-500"
                      : "data-[state=active]:bg-card data-[state=active]:text-primary")
                  }
                >
                  {section}
                </TabsTrigger>
              ))}
              <TabsTrigger
                key="All"
                value="All"
                className="hidden"
              >
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[118px] z-10 bg-background border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto bg-transparent gap-2 p-0">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className={
                    (category === "All"
                      ? "rounded-full px-4 py-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-white"
                      : "rounded-full px-4 py-2 text-cyan-300 hover:text-cyan-200") +
                    " whitespace-nowrap"
                  }
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {Object.entries(groupedItems).map(([category, items]) => (
          <section key={category} className="mb-12">
            <h2 className="text-3xl font-bold mb-6">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden">
                  {item.image_url && (
                    <div className="aspect-video bg-muted relative">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                      <p className="text-xl font-bold text-primary whitespace-nowrap">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;
