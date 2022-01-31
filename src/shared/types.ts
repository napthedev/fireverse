export interface ConversationInfo {
  users: string[];
  group: {
    admins: string[];
    groupName: null | string;
    groupImage: null | string;
  } | null;
}

export interface SavedUser {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string;
  phoneNumber: string | null;
}
