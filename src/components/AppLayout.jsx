import Footer from "./Footer";
import Header from "./Header"; // Assuming there's a generic header for non-logged in users

function AppLayout({ children }) {
  return (
    <>
      <Header />
      <main className="container my-4">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default AppLayout;
