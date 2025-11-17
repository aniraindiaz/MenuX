import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const QRCodeGenerator = () => {
  const { toast } = useToast();
  const menuUrl = `${window.location.origin}/menu`;

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      if (ctx) {
        // Fill white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw QR code
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "menu-qr-code.png";
            link.click();
            URL.revokeObjectURL(url);
            toast({
              title: "QR Code Downloaded",
              description: "Your QR code has been downloaded successfully",
            });
          }
        });
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Menu QR Code",
          text: "Scan this QR code to view our menu",
          url: menuUrl,
        });
        toast({
          title: "Shared",
          description: "QR code link shared successfully",
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast({
            title: "Error",
            description: "Failed to share",
            variant: "destructive",
          });
        }
      }
    } else {
      navigator.clipboard.writeText(menuUrl);
      toast({
        title: "Link Copied",
        description: "Menu link copied to clipboard",
      });
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Download or share your menu QR code</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="p-8 bg-white rounded-xl">
          <QRCode
            id="qr-code"
            value={menuUrl}
            size={256}
            level="H"
          />
        </div>
        
        <div className="flex gap-4">
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Scan this QR code to view the menu at:<br />
          <span className="text-primary font-mono text-xs break-all">{menuUrl}</span>
        </p>
      </CardContent>
    </Card>
  );
};
