import React, { useState } from "react";
import GetUsers from "../GetUsers";
import { api } from "~/utils/api";
import GetOffices from "../GetOffices";
import Link from "next/link";
import FetchRole from "~/hooks/fetchRole";

const SystemAdminPage = () => {
  const role = FetchRole();
  return (
    <div className="flex flex-col items-center justify-center gap-x-4 gap-y-4 py-24 md:flex-row">
      {(role === "SuperAdmin" || role==="SystemAdmin") && (
        <Link
          href={`/actionlog`}
          className="inline-flex w-48 items-center justify-center rounded-md  border-2 border-babyblue bg-white px-4 py-2 text-center text-base font-medium text-babyblue active:scale-97 transition duration-75 hover:bg-babyblue hover:text-white disabled:cursor-not-allowed disabled:bg-gray-400 "
        >
          View action log
        </Link>
      )}
      <Link
        href={`/console/${role}/office`}
        className="inline-flex w-48 items-center justify-center rounded-md  border-2 border-babyblue bg-white px-4 py-2 text-center text-base font-medium text-babyblue transition active:scale-97 duration-75 hover:bg-babyblue hover:text-white disabled:cursor-not-allowed disabled:bg-gray-400 "
      >
        Manage Offices
      </Link>
      <Link
        href={`/console/${role}/patient`}
        className="inline-flex w-48 items-center justify-center rounded-md  border-2 border-babyblue bg-white px-4 py-2 text-center text-base font-medium text-babyblue transition active:scale-97 duration-75 hover:bg-babyblue hover:text-white disabled:cursor-not-allowed disabled:bg-gray-400 "
      >
        Manage Users
      </Link>
    </div>
  );
};

export default SystemAdminPage;
