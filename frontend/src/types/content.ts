export type PublicContentResponse = {
  siteSettings: {
    organizationName: string;
    theme: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    footerCopyright?: string;
    footerBuilderName?: string;
    footerBuilderUrl?: string;
    defaultSeoTitle?: string;
    defaultSeoDescription?: string;
  };
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    heroBackgroundImage?: string;
    ctaPrimaryLabel?: string;
    ctaPrimaryLink?: string;
    ctaSecondaryLabel?: string;
    ctaSecondaryLink?: string;
    ctaThirdLabel?: string;
    ctaThirdLink?: string;
    impactStats?: Array<{ label: string; value: string }>;
    highlightedSections?: Array<{ title: string; description: string }>;
  };
  about: {
    introduction: string;
    vision: string;
    mission: string;
    coreValues?: string[];
    presidentsMessage?: string;
    presidentsImage?: string;
    bannerImage?: string;
  };
  leadership: Array<{
    id: number;
    fullName: string;
    roleTitle: string;
    photoUrl?: string;
    shortBio: string;
    committeeType?: 'EXECUTIVE_COMMITTEE' | 'BOARD_MEMBER';
    socialLinks?: Array<{ label: string; url: string }>;
  }>;
  projects: Array<{
    id: number;
    title: string;
    category: string;
    date: string;
    coverImage?: string;
    galleryImages?: string[];
    description: string;
    objectives?: string;
    outcomes?: string;
  }>;
  events: Array<{
    id: number;
    title: string;
    eventDateTime: string;
    endDateTime?: string;
    venue: string;
    description: string;
    detailedDescription?: string;
    posterUrl?: string;
    galleryImages?: string[];
    participantsInfo?: string;
    organizer?: string;
    contactInfo?: string;
    registrationLink?: string;
    eventStatus: string;
    isFeatured: boolean;
  }>;
  galleryAlbums: Array<{
    id: number;
    title: string;
    images: Array<{ id: number; imageUrl: string; caption?: string }>;
  }>;
  membership: {
    introText: string;
    whyJoinPoints?: string[];
    benefits?: string[];
    eligibility?: string;
    joinFormLink?: string;
  };
  blogPosts: Array<{
    id: number;
    title: string;
    slug: string;
    featuredImage?: string;
    magazinePdfUrl?: string;
    author: string;
    publishDate: string;
    content: string;
    status: string;
  }>;
  polls: Array<{
    id: number;
    title: string;
    description?: string;
    options?: string[];
    thumbnailImage?: string;
    externalLink?: string;
    status: string;
  }>;
  notices: Array<{
    id: number;
    title: string;
    summary?: string;
    content?: string;
    noticeDate?: string;
    thumbnailImage?: string;
    externalLink?: string;
    status: string;
  }>;
  contact: {
    email: string;
    phone: string;
    address: string;
    googleMapsEmbed?: string;
    contactFormRecipientEmail?: string;
  };
  socialLinks: Array<{ id: number; platform: string; url: string }>;
};
