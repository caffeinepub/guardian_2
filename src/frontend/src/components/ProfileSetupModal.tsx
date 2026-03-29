import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveProfile } from "../hooks/useQueries";

export default function ProfileSetupModal() {
  const [name, setName] = useState("");
  const saveProfile = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success("Welcome to She Safe!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        data-ocid="profile_setup.dialog"
        className="sm:max-w-md border-border"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/assets/generated/she-safe-logo-transparent.dim_120x120.png"
              alt="She Safe"
              className="h-10 w-10 object-contain"
            />
            <DialogTitle className="font-display text-xl text-primary">
              Welcome to She Safe
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Please enter your name to set up your safety profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label
              htmlFor="profile-name"
              className="text-foreground font-medium"
            >
              Your Name
            </Label>
            <Input
              id="profile-name"
              data-ocid="profile_setup.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border-input focus:ring-ring"
              autoFocus
            />
          </div>
          <Button
            data-ocid="profile_setup.submit_button"
            type="submit"
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up...
              </>
            ) : (
              "Let's Get Started"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
