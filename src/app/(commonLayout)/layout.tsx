import { Navbar } from "@/components/navbar/Navbar";


export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
     <Navbar isLoggedIn={true}/>
      <main className="flex-1">{children}</main>
    </div>
  );
}