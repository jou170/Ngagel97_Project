"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import NavbarUser from "../(routes)/(user)/components/NavbarUser";
import NavbarPublic from "../(routes)/(public)/components/NavbarPublic";
import NavbarInvalid from "../(routes)/(public)/components/NavbarInvalid";

const NavbarDynamic = () => {
  const [role, setRole] = useState(null);

  // Memantau perubahan cookies untuk role
  useEffect(() => {
    const checkRole = () => {
      const userRole = Cookies.get("role");
      if (userRole) {
        setRole(userRole.toLocaleLowerCase());
      } else {
        setRole(null); // Jika tidak ada role di cookie
      }
    };

    // Cek role pertama kali dan setiap kali cookies berubah
    checkRole();

    // Set interval untuk memeriksa perubahan cookie
    const interval = setInterval(checkRole, 1000);

    // Cleanup interval saat komponen unmount
    return () => clearInterval(interval);
  }, []);
  if (role === "user") {
    return <NavbarUser />;
  } else if (!role) {
    return <NavbarPublic />;
  }
};

export default NavbarDynamic;
