import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/Footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="min-h-screen text-gray-900">{children}</main>
      <Footer />
    </>
  );
}