import { IBM_Plex_Sans_Thai, Noto_Sans_Thai } from "next/font/google";

export const ibmFlexSans = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  display: "swap",
  weight: ["400", "700"],
});

export const notoSansThai = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  display: "swap",
  weight: ["400", "700"],
});
