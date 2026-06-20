"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, FileSpreadsheet, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { getApiBaseUrl } from "@/lib/api";

export function CsvUploadControls() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "stopped">("idle");
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === "success") {
        e.preventDefault();
        e.returnValue = "Simulation is running. Refreshing will stop the simulation and clear the queue.";
      }
    };

    const handleUnload = () => {
      if (status === "success") {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || "dev_public_key_for_frontend";
        
        fetch(`${getApiBaseUrl()}/predict/upload/cancel`, {
          method: "POST",
          headers: { "X-API-Key": apiKey },
          keepalive: true,
        }).catch(console.error);

        fetch(`${getApiBaseUrl()}/alerts`, {
          method: "DELETE",
          headers: { "X-API-Key": apiKey },
          keepalive: true,
        }).catch(console.error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus("idle");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "dev_public_key_for_frontend";
      
      const response = await fetch(`${getApiBaseUrl()}/predict/upload`, {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      setStatus("success");
      setMessage(`Success! ${data.rows_queued} rows queued. Simulating traffic...`);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setUploading(false);
    }
  };

  const handleStop = async () => {
    setStopping(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "dev_public_key_for_frontend";
      const response = await fetch(`${getApiBaseUrl()}/predict/upload/cancel`, {
        method: "POST",
        headers: { "X-API-Key": apiKey },
      });
      if (response.ok) {
        setStatus("stopped");
        setMessage("Upload processing stopped.");
      }
    } catch (error) {
      console.error("Failed to stop upload", error);
    } finally {
      setStopping(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear all historical alerts and dashboard data? This cannot be undone.")) return;
    setClearing(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "dev_public_key_for_frontend";
      
      await fetch(`${getApiBaseUrl()}/predict/upload/cancel`, {
        method: "POST",
        headers: { "X-API-Key": apiKey },
      }).catch(e => console.error("Failed to cancel upload simulation:", e));

      const response = await fetch(`${getApiBaseUrl()}/alerts`, {
        method: "DELETE",
        headers: { "X-API-Key": apiKey },
      });
      if (!response.ok) {
        throw new Error("Failed to clear dashboard");
      }
      window.location.reload();
    } catch (error) {
      console.error("Clear dashboard error:", error);
    } finally {
      setClearing(false);
    }
  };

  const toneClass = status === "error"
    ? "border-rose-400 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/10 text-rose-900 dark:text-rose-200"
    : status === "success"
      ? "border-emerald-400 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200"
      : "border-cyan-400 dark:border-cyan-900/60 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-900 dark:text-cyan-200";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card size="sm" className={cn("backdrop-blur-sm", toneClass)}>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="flex items-center gap-2 text-sm text-inherit">
              <FileSpreadsheet className="size-4" />
              Upload Logs (CSV)
            </CardTitle>
            <CardDescription className="max-w-2xl text-[0.72rem] text-inherit/75">
              Upload custom network records to dynamically process them through the model.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
             <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] whitespace-nowrap",
                status === "error"
                  ? "border-rose-300 dark:border-rose-800/70 text-rose-700 dark:text-rose-300"
                  : status === "stopped"
                    ? "border-amber-300 dark:border-amber-800/70 text-amber-700 dark:text-amber-300"
                    : status === "success"
                      ? "border-emerald-300 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300"
                      : "border-cyan-300 dark:border-cyan-800/70 text-cyan-700 dark:text-cyan-300"
              )}
            >
              {status === "error" ? "Failed" : status === "stopped" ? "Stopped" : status === "success" ? "Done" : "Ready"}
            </span>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-current/20 bg-card hover:bg-muted text-foreground"
              >
                Controls
                <ChevronDown
                  className={cn("size-3.5 transition-transform", open && "rotate-180")}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 border-t border-current/10 pt-4">
            
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label 
                htmlFor="csv-upload"
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-dashed border-current/30 bg-card px-4 py-6 text-sm tracking-normal text-foreground cursor-pointer hover:bg-muted transition"
              >
                <UploadCloud className="size-5 opacity-70" />
                <span className="opacity-80">
                  {file ? file.name : "Click to select or drag and drop a CSV file"}
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                {status === "success" && <CheckCircle2 className="size-4 text-emerald-500" />}
                {status === "error" && <AlertCircle className="size-4 text-rose-500" />}
                <span className={status === "error" ? "text-rose-600 dark:text-rose-300" : "text-inherit/80"}>
                  {message || (file ? "Ready to upload" : "")}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClear}
                  disabled={uploading || clearing || stopping}
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50 mr-auto"
                >
                  <Trash2 className="size-3.5 mr-1" />
                  Clear All
                </Button>
                {status === "success" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleStop}
                    disabled={stopping}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                  >
                    {stopping ? "Stopping..." : "Stop Upload"}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="bg-cyan-500 text-slate-50 hover:bg-cyan-400 dark:text-slate-950 min-w-[100px]"
                >
                  {uploading ? (
                     <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Uploading...
                     </span>
                  ) : (
                    <>Upload & Process</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
