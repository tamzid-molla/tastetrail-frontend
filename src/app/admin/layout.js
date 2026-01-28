import SimpleSidebar from "@/components/admin/SimpleSidebar";
import FixedHeader from "@/components/admin/FixedHeader";
import { SidebarProvider } from "@/context/SidebarContext";

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <FixedHeader />
      <SimpleSidebar>{children}</SimpleSidebar>
    </SidebarProvider>
  );
}
