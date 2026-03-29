import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone, Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddContact,
  useGetContacts,
  useRemoveContact,
} from "../hooks/useQueries";

export default function ContactsPage() {
  const { data: contacts, isLoading } = useGetContacts();
  const addContact = useAddContact();
  const removeContact = useRemoveContact();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    try {
      await addContact.mutateAsync({ name: name.trim(), phone: phone.trim() });
      setName("");
      setPhone("");
      toast.success(`${name} added to your trusted contacts.`);
    } catch {
      toast.error("Failed to add contact. Please try again.");
    }
  };

  const handleRemove = async (contactName: string, phone: string) => {
    try {
      await removeContact.mutateAsync(phone);
      toast.success(`${contactName} removed from contacts.`);
    } catch {
      toast.error("Failed to remove contact.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h2 className="font-display text-2xl font-bold text-primary">
        Trusted Contacts
      </h2>

      {/* Add Contact Form */}
      <Card className="border-border shadow-card-pink">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-accent" />
            Add New Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="contact-name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="contact-name"
                  data-ocid="contacts.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="border-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="contact-phone"
                  data-ocid="contacts.phone.input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  className="border-input"
                />
              </div>
            </div>
            <Button
              data-ocid="contacts.submit_button"
              type="submit"
              disabled={!name.trim() || !phone.trim() || addContact.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold w-full sm:w-auto"
            >
              {addContact.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Contact
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card className="border-border shadow-card-pink">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            Your Contacts
            {contacts && contacts.length > 0 && (
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {contacts.length} contacts
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              data-ocid="contacts.loading_state"
              className="flex justify-center py-8"
            >
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : !contacts || contacts.length === 0 ? (
            <div
              data-ocid="contacts.empty_state"
              className="text-center py-10 text-muted-foreground"
            >
              <Users className="h-10 w-10 mx-auto mb-3 text-border" />
              <p className="font-medium text-sm">No trusted contacts yet</p>
              <p className="text-xs mt-1">
                Add emergency contacts who will receive your SOS alerts.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact, idx) => (
                <div
                  key={contact.phone}
                  data-ocid={`contacts.item.${idx + 1}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary text-sm">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {contact.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </div>
                    </div>
                  </div>
                  <Button
                    data-ocid={`contacts.delete_button.${idx + 1}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(contact.name, contact.phone)}
                    disabled={removeContact.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
