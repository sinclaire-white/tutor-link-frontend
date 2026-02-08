import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";


export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
     <Navbar isLoggedIn={false}/>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}