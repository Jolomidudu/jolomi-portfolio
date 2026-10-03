import type { Metadata } from "next";
import EnquiryPortal from "./enquiry-portal";

export const metadata: Metadata = {
  title: "Enquiry Portal | Jolomi Dudu",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return <EnquiryPortal />;
}