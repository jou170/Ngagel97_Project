import AdminNavbar from "./components/AdminNavbar";


export default function AdminLayout({
  children, // will be a page or nested layout
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <AdminNavbar/>

      {children}
    </section>
  );
}
