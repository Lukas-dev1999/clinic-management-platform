import React, { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import GetOffices from "~/components/GetOffices";
import FetchRole from "~/hooks/fetchRole";
import { api } from "~/utils/api";

const OfficesPage = () => {
  const ctx = api.useContext();
  const role = FetchRole();
  const [officeName, setOfficeName] = useState("");
  
  const addToTable = api.officeRoute.addToTable.useMutation();
  const createOffice = api.officeRoute.createOffice.useMutation({
    onSuccess() {
      toast.success("Office created");
      void ctx.officeRoute.getAllOffices.invalidate();
      addToTable.mutate(`Created office named ${officeName}`);
    },
  });
  return (
    <div className="flex flex-col  items-center justify-center gap-x-48 py-24 2xl:flex-row">
      {(role === "SystemAdmin" || role === "SuperAdmin") && (
        <div className="flex w-full max-w-[18rem] flex-col gap-y-4">
          <div className=" flex  items-center justify-center gap-x-4 text-lg font-bold">
            <p className="text-center">Create Office </p>{" "}
            {createOffice.isLoading && (
              <LoaderIcon style={{ minWidth: "20px", minHeight: "20px" }} />
            )}
          </div>
          <input
            type="text"
            required
            className="   rounded-md border border-black px-4 py-2"
            placeholder="name of office"
            onChange={(e) => setOfficeName(e.target.value)}
          />
          <button
            className="inline-flex items-center justify-center rounded-md border-2 border-babyblue bg-white px-4 py-2  text-center text-base font-medium text-babyblue transition duration-75 hover:bg-babyblue hover:text-white active:scale-97 disabled:cursor-not-allowed disabled:bg-gray-400 "
            onClick={() => {
              if (officeName.trim().length === 0) {
                toast.error("Please add a name to your office");
                return;
              }
              createOffice.mutate({ input: officeName });
            }}
          >
            Create Office
          </button>
        </div>
      )}
      <GetOffices />
    </div>
  );
};

export default OfficesPage;
