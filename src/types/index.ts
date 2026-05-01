export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  iss: string;
  userId: number;
  roles?: string[] | string | null;
  fullName?: string | null;
  displayName?: string | null;
  lang?: string | null;
  photoUrl?: string | null;
  uiPreferences?: {
    isDarkMode?: boolean;
    pinHeader?: boolean;
    pinFooter?: boolean;
    navbarCollapsed?: boolean;
  } | null;
}

export interface UserPreferences {
  lang?: string;
  isDarkMode?: boolean;
  pinHeader?: boolean;
  pinFooter?: boolean;
  navbarCollapsed?: boolean;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  price: number;
  isActive: boolean;
  description?: string;
}

export interface BookPageResponse {
  content: Book[];
  number: number;
  totalPages: number;
  totalElements: number;
}
