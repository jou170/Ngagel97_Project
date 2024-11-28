import NavbarMaster from "./components/NavbarMaster";

export default function MasterLayout({
  children, // will be a page or nested layout
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <NavbarMaster />

      {children}
    </section>
  );
}
