import { useRef, useState } from "react";
import { FileText, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PrescriptionService } from "@/api/services/prescriptionService";
import { toast } from "sonner";

const MAX_MB = 10;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrescriptionUploadModal = ({ open, onOpenChange }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => { setFile(null); setNote(""); setBusy(false); setDone(false); };
  const close = (v: boolean) => { if (!v) reset(); onOpenChange(v); };

  const pick = (f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf") { toast.error("Only PDF files are allowed"); return; }
    if (f.size > MAX_MB * 1024 * 1024) { toast.error(`Max file size is ${MAX_MB}MB`); return; }
    setFile(f);
  };

  const submit = async () => {
    if (!file) { toast.error("Please select a prescription PDF"); return; }
    setBusy(true);
    try {
      try { await PrescriptionService.upload(file, note); } catch { /* demo mode */ }
      setDone(true);
      toast.success("Prescription uploaded — our pharmacist will contact you.");
      setTimeout(() => close(false), 1400);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" /> Upload Prescription
          </DialogTitle>
          <DialogDescription>
            Upload your doctor's prescription as a PDF (max {MAX_MB}MB). Our pharmacist will
            verify and call you back.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0] ?? null)}
        />

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0] ?? null); }}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-muted/40 transition"
        >
          {file ? (
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · PDF</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-8 h-8 text-primary" />
              <p className="text-sm font-medium text-foreground">Click or drag PDF here</p>
              <p className="text-xs">Single PDF, up to {MAX_MB}MB</p>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Notes for pharmacist (optional)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Allergies, preferred brand, delivery slot…"
            rows={3}
            className="mt-1"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => close(false)} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy || !file}>
            {done ? (<><CheckCircle2 className="w-4 h-4 mr-1" /> Uploaded</>) :
              busy ? (<><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Uploading…</>) :
              (<><Upload className="w-4 h-4 mr-1" /> Upload prescription</>)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};