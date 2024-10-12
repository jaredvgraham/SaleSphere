import SalesEditor from "@/components/emailEditor";
import React from "react";

const page = () => {
  const companyId = "1234";
  return (
    <div>
      <SalesEditor companyId={companyId} />
    </div>
  );
};

export default page;
