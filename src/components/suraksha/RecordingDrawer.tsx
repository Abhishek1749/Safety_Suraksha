import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CloudUpload, Mic, Video, Square, Lock, CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  mode: "audio" | "video";
  onOpenChange: (open: boolean) => void;
};

const BACKUPS = [
  { id: "SRK-2291", at: "18:42:07", size: "12.4 MB", state: "Encrypted · synced" },
  { id: "SRK-2290", at: "17:05:52", size: "4.1 MB", state: "Encrypted · synced" },
  { id: "SRK-2289", at: "Yesterday 22:18", size: "31.7 MB", state: "Encrypted · synced" },
];

export function RecordingDrawer({ open, mode, onOpenChange }: Props) {
  const [recording, setRecording] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 56 }, () => 0.2));
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setRecording(true);
    setSeconds(0);
  }, [open, mode]);

  useEffect(() => {
    if (!open || !recording) return;
    timer.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
      setBars((prev) => [...prev.slice(1), 0.15 + Math.random() * 0.85]);
    }, 220);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [open, recording]);

  const mm = String(Math.floor(seconds / 5 / 60)).padStart(2, "0");
  const ss = String(Math.floor(seconds / 5) % 60).padStart(2, "0");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto border-border bg-background">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2 font-display">
            {mode === "audio" ? (
              <Mic className="size-5 text-crimson" aria-hidden />
            ) : (
              <Video className="size-5 text-crimson" aria-hidden />
            )}
            Stealth {mode} recording
          </SheetTitle>
          <SheetDescription>
            Screen stays dark on your device. Files encrypt locally, then upload to your vault.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-8">
          <div className="glass rounded-2xl p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <span
                  className={`size-2.5 shrink-0 rounded-full ${recording ? "bg-crimson animate-pulse-dot" : "bg-muted-foreground"}`}
                />
                <span className="truncate">{recording ? "Recording" : "Paused"} · Sector 22</span>
              </span>
              <span className="shrink-0 font-mono text-lg tabular-nums">
                {mm}:{ss}
              </span>
            </div>

            <div className="mt-4 flex h-24 items-end gap-[3px]" aria-hidden>
              {bars.map((b, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-full bg-gradient-to-t from-crimson/40 to-crimson transition-all duration-200"
                  style={{ height: `${(recording ? b : 0.12) * 100}%` }}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => setRecording((r) => !r)}
                className="min-h-11 bg-crimson text-primary-foreground hover:bg-crimson/90"
              >
                {recording ? <Square className="size-4" /> : <Mic className="size-4" />}
                {recording ? "Stop & save" : "Resume"}
              </Button>
              <Button variant="secondary" className="min-h-11">
                <CloudUpload className="size-4" /> Force cloud backup
              </Button>
              <Button variant="ghost" className="min-h-11">
                <Lock className="size-4" /> Lock vault
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Cloud backup log
            </h3>
            <ul className="mt-3 space-y-2">
              {BACKUPS.map((b) => (
                <li
                  key={b.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-surface-2/70 px-4 py-3 ring-1 ring-border"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-sm">{b.id}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {b.at} · {b.size}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-emerald">
                    <CheckCircle2 className="size-4" aria-hidden /> {b.state}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
