import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import AlertHistoryPage from "./pages/AlertHistoryPage";
import ContactsPage from "./pages/ContactsPage";
import HomePage from "./pages/HomePage";
import LocationPage from "./pages/LocationPage";

export type TabId = "home" | "location" | "contacts" | "alerts";

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
      />
      <main className="flex-1 pb-20 md:pb-0">
        {activeTab === "home" && <HomePage userProfile={userProfile} />}
        {activeTab === "location" && <LocationPage />}
        {activeTab === "contacts" && <ContactsPage />}
        {activeTab === "alerts" && <AlertHistoryPage />}
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </div>
  );
}
