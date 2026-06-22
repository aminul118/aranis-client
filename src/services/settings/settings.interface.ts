export interface ISocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

export interface ISiteSetting {
  _id?: string;
  logo: string;
  socialLinks: ISocialLink[];
  contactNumber?: string;
  email?: string;
  location?: string;
}
