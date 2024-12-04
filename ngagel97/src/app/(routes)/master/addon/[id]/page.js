"use client";

import { useEffect, useState } from "react";
import AddOnForm from "../../components/AddOnForm";

const EditAddOnPage = ({ params }) => {
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchParams = async () => {
      // Mengambil nilai id dari params
      const { id } = await params;
      setId(id);
    };

    fetchParams(); // Panggil fungsi untuk mengambil id dari params
  }, [params]);

  if (!id) {
    return <div>Loading...</div>; // Render loading jika id belum tersedia
  }

  return (
    <div>
      <AddOnForm mode="edit" id={id} />
    </div>
  );
};

export default EditAddOnPage;
