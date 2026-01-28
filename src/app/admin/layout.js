import SimpleSidebar from "@/components/admin/SimpleSidebar";

export default function AdminLayout({ children }) {
  return (
    <SimpleSidebar>
      {children}
    </SimpleSidebar>
  );
}