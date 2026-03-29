import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Float "mo:core/Float";
import Nat64 "mo:core/Nat64";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Contact = {
    name : Text;
    phone : Text;
  };

  public type Alert = {
    timestamp : Nat64;
    latitude : Float;
    longitude : Float;
  };

  public type CheckIn = {
    timestamp : Nat64;
    latitude : Float;
    longitude : Float;
  };

  public type UserProfile = {
    name : Text;
  };

  module Contact {
    public func compare(contact1 : Contact, contact2 : Contact) : Order.Order {
      Text.compare(contact1.phone, contact2.phone);
    };
  };

  module Alert {
    public func compare(alert1 : Alert, alert2 : Alert) : Order.Order {
      Nat64.compare(alert2.timestamp, alert1.timestamp);
    };
  };

  module CheckIn {
    public func compare(checkIn1 : CheckIn, checkIn2 : CheckIn) : Order.Order {
      Nat64.compare(checkIn2.timestamp, checkIn1.timestamp);
    };
  };

  let contacts = Map.empty<Principal, List.List<Contact>>();
  let alerts = Map.empty<Principal, List.List<Alert>>();
  let checkIns = Map.empty<Principal, List.List<CheckIn>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addContact(name : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    if (name.size() == 0 or phone.size() == 0) { Runtime.trap("Name and phone number cannot be empty.") };
    let contact : Contact = { name; phone };
    let userContacts = switch (contacts.get(caller)) {
      case (null) { List.empty<Contact>() };
      case (?list) { list };
    };
    userContacts.add(contact);
    contacts.add(caller, userContacts);
  };

  public shared ({ caller }) func removeContact(phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let userContacts = switch (contacts.get(caller)) {
      case (null) { List.empty<Contact>() };
      case (?list) { list };
    };
    let filteredContacts = List.empty<Contact>();
    let iter = userContacts.values();
    for (contact in iter) {
      if (contact.phone != phone) {
        filteredContacts.add(contact);
      };
    };
    contacts.add(caller, filteredContacts);
  };

  public query ({ caller }) func getContacts() : async [Contact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (contacts.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray().sort() };
    };
  };

  public shared ({ caller }) func sendSOS(latitude : Float, longitude : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let alert : Alert = {
      timestamp = Nat64.fromIntWrap(Time.now());
      latitude;
      longitude;
    };
    let userAlerts = switch (alerts.get(caller)) {
      case (null) { List.empty<Alert>() };
      case (?list) { list };
    };
    userAlerts.add(alert);
    alerts.add(caller, userAlerts);
  };

  public query ({ caller }) func getAlertHistory() : async [Alert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (alerts.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray().sort(Alert.compare) };
    };
  };

  public shared ({ caller }) func checkIn(latitude : Float, longitude : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let checkIn : CheckIn = {
      timestamp = Nat64.fromIntWrap(Time.now());
      latitude;
      longitude;
    };
    let userCheckIns = switch (checkIns.get(caller)) {
      case (null) { List.empty<CheckIn>() };
      case (?list) { list };
    };
    userCheckIns.add(checkIn);
    checkIns.add(caller, userCheckIns);
  };

  public query ({ caller }) func getLocationHistory() : async [CheckIn] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (checkIns.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray().sort(CheckIn.compare) };
    };
  };
};
