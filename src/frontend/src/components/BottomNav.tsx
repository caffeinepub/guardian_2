import { Bell, MapPin, Shield, Users } from "lucide-react";
import type { TabId } from "../App";

interface BottomNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const TABS = [
  { id: "home" as TabId, label: "SOS", icon: Shield },
  { id: "location" as TabId, label: "Tracker", icon: MapPin },
  { id: "contacts" as TabId, label: "Contacts", icon: Users },
  { id: "alerts" as TabId, label: "History", icon: Bell },
];

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-50"
      aria-label="Bottom navigation"
    >
      <div className="flex">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              data-ocid={`bottom_nav.${tab.id}.link`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                isActive ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-accent/20" : ""}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
