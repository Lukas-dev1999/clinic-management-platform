import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import User from "~/components/User";
import { api } from "~/utils/api";

const GetUsers = () => {
  const users = api.officeRoute.getAllUsers.useQuery();
  const [search, setSearch] = useState<string>("");

  //To search and filter the users.
  const filteredSearch = users.data?.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) 
  );

  return (
    <div className="flex w-full flex-col  items-center justify-center py-12">
      
      <label className="mt-6" htmlFor="search" id="search">
        Search Clients:
      </label>
      <input
        name="search"
        placeholder="Search for a name"
        id="search"
        className="mb-12 mt-3 rounded-md border border-black px-4 py-2"
        type="text"
        onChange={(value) => setSearch(value.target.value)}
      />

      {users.isLoading && (
        <LoaderIcon style={{ minWidth: "100px", minHeight: "100px" }} />
      )}

      <div className="mt-8 grid grid-cols-1 gap-8  md:grid-cols-2 xl:grid-cols-3 ">
        {users.isSuccess &&
          filteredSearch?.map((user) => {
          

            return (
              <User
                key={user.id}
                name={user.name as string}
                email={user.email as string}
                userId={user.id}
                roles={user.roles}
              />
            );
          })}
      </div>
    </div>
  );
};

export default GetUsers;
