import { Translations } from './ru';

export const en: Translations = {
  // LoginView
  loginTitle: "System Login",
  registerTitle: "Register Administrator",
  registerHint: "No users in the database. Create the main system administrator.",
  emailLabel: "Email address",
  passwordLabel: "Password",
  loading: "Loading...",
  loginBtn: "Sign In",
  registerBtn: "Create Administrator",

  // AdminDashboardClient
  cmsTitle: "Site Management (CMS)",
  tabContent: "Content",
  tabMedia: "Media Library",
  tabUsers: "Users",
  logout: "Logout",
  switchToSite: "Go to site",

  // ContentManager
  contentTitle: "Content Management",
  noData: "No data",
  addBtn: "+ Add",
  deleteConfirm: "Delete this item?",
  cannotDeleteLast: "Cannot delete everything! At least one item must remain.",
  noPhoto: "No photo",
  uploadFile: "Upload",
  orInsertUrl: "Or insert URL",
  saveBtn: "💾 Save",
  saveSuccess: "Successfully saved!",
  saveError: "Error saving:",
  uploadError: "Upload error",

  // MediaLibrary
  mediaTitle: "Media Library",
  mediaHint: "All uploaded images are stored here. You can copy the link to embed or delete unused ones.",
  uploadNewFile: "Upload new file",
  noMediaFiles: "No files yet",
  uploading: "Uploading...",
  linkCopied: "Link copied!",
  copyLink: "Copy URL",
  deleteFileConfirm: "Are you sure you want to permanently delete this file?",

  // UserList
  usersTitle: "System Users List",
  noUsers: "No users",
  emailHeader: "Email",
  roleHeader: "Role",
  actionsHeader: "Actions",
  changePassword: "Change Password",
  deleteUser: "Delete",
  deleteUserConfirm: "Are you sure you want to delete user",
  newPasswordPrompt: "Enter new password for",
  passwordTooShort: "Password is too short!",
  passwordChanged: "Password successfully changed!",

  // MediaUploader
  mediaUploaderTitle: "Media Storage",
  mediaUploaderHint: "Upload an image (JPG/PNG). The backend will compress it to WebP.",
  mediaUploaderConvertSuccess: "✅ Converted to WebP!",
  mediaUploaderBtnUploading: "Uploading and converting...",
  mediaUploaderBtn: "Upload File",
  mediaUploaderUrlHint: "File URL (copy to JSON):",

  // CreateClientForm
  createClientTitle: "Add Client",
  createClientHint: "Create an account for the site owner. Role: CLIENT.",
  createClientBtn: "Create Client",
  createClientBtnCreating: "Creating...",
  createClientSuccess: "Client successfully created!",
};
