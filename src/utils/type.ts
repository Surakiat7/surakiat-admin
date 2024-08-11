// Type for Song data findall
export type Song = {
  id: number;
  songname: string;
  artist: string;
  recordlabel: string;
  songcode: string;
  note: string;
};

// Type for User data findall
export type User = {
  id: number;
  fullname: string;
  statususer: "Active" | "Inactive" | "Pending";
  permission: "Admin" | "User" | "Moderator";
};

// Type for Record Label data findall
export type RecordLabel = {
  id: number;
  recordlabelName: string;
  totalsong: string;
};

// -------------------------------------------------- Create --------------------------------------------------

export type CreateSongFormValues = {
  songname: string;
  artist: string;
  idcategory: number;
  songCode: string;
  note: string;
  newsong: boolean;
};

export type CreateCategorySongFormValues = {
  recordlabelName: string;
};

export type CreateUserFormValues = {
  fname: string;
  lname: string;
  email: string;
  password: string;
};

// -------------------------------------------------- Update --------------------------------------------------

export type UpdateSongFormValues = {
  songname?: string;
  artist?: string;
  idcategory?: number;
  songCode?: string;
  note?: string;
  newsong: boolean;
};

export type UpdateUserFormValues = {
  fullname?: string;
  statususer?: "Active" | "Inactive" | "Pending";
  permission?: "Admin" | "User" | "Moderator";
};

export type UpdateRecordLabelFormValues = {
  recordlabelName?: string;
};

// -------------------------------------------------- Delete --------------------------------------------------

export type DeleteSongParams = {
  id: number;
};

export type DeleteUserParams = {
  id: number;
};

export type DeleteRecordLabelParams = {
  id: number;
};

// -------------------------------------------------- Errors --------------------------------------------------

export type TypeFormErrors = {
  emailError?: string;
  passwordError?: string;
};

// -------------------------------------------------- API Responses --------------------------------------------------

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  messageTH?: string;
  messageEN?: string;
};
