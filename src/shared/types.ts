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

export interface MessageItem {
  sender: string;
  content: string;
  file?: {
    name: string;
    size: number;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  type: "text" | "image" | "file" | "removed";
}
