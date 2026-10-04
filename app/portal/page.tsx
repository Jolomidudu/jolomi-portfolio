import type { Metadata } from "next";
import EnquiryPortal from "./enquiry-portal";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return <EnquiryPortal />;
}