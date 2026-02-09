import { Footer } from "@/components/footer/Footer";
import { ClientNavbar } from "@/components/navbar/ClientNavbar";


export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
     <ClientNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}