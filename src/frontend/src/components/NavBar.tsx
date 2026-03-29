import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User } from "lucide-react";
import type { TabId } from "../App";
import type { UserProfile } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavBarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  userProfile: UserProfile | null | undefined;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "SOS" },
  { id: "location", label: "Tracker" },
  { id: "contacts", label: "Contacts" },
  { id: "alerts", label: "History" },
];

export default function NavBar({
  activeTab,
  setActiveTab,
  userProfile,
}: NavBarProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/she-safe-logo-transparent.dim_120x120.png"
            alt="She Safe"
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-xl font-bold text-primary-foreground tracking-wide">
            She Safe
          </span>
        </div>

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              data-ocid={`nav.${tab.id}.link`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {userProfile && (
            <div className="hidden sm:flex items-center gap-2 text-primary-foreground/80 text-sm">
              <User className="h-4 w-4" />
              <span>{userProfile.name}</span>
            </div>
          )}
          <Button
            data-ocid="nav.logout.button"
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
