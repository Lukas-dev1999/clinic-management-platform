import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { api } from "~/utils/api";
import Office from "./Office";

const GetOffices = () => {
  const offices = api.officeRoute.getAllOffices.useQuery();
  const [search, setSearch] = useState<string>("");

  //To search and filter the offices.
  const filteredSearch = offices.data?.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) 
  );

  return (
    <div className="flex  max-w-5xl flex-col  items-center justify-center py-12">
      
      <label className="mt-6 text-center font-bold text-lg" htmlFor="search" id="search">
        Search offices:
      </label>
      <input
        name="search"
        placeholder="Search for an office"
        id="search"
        className="mb-6 mt-3 rounded-md border border-black px-4 py-2"
        type="text"
        onChange={(value) => setSearch(value.target.value)}
      />

      {offices.isLoading && (
        <LoaderIcon style={{ minWidth: "100px", minHeight: "100px" }} />
      )}

      <div className="mt-8 grid grid-cols-1 gap-8  md:grid-cols-2 xl:grid-cols-3 ">
        {offices.isSuccess &&
          filteredSearch?.map((office) => {
          

            return (
              <Office
                key={office.id}
                name={office.name as string}
                id={office.id}
              />
            );
          })}
      </div>
    </div>
  );
};

export default GetOffices;

//old styles
