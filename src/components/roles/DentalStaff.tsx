/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { api } from "~/utils/api";
import Office from "../Office";
import { useSession } from "next-auth/react";
import { LoaderIcon } from "react-hot-toast";
const DentalStaff = () => {
  const session = useSession();

  const role = api.officeRoute.getRole.useQuery({
    input: session.data?.user.id as string,
  });
  const dentalOffices = api.officeRoute.getJoinedOffices.useQuery();

  return (
    <div className="flex flex-col items-center gap-y-6 py-12">
      <p className="text-lg font-bold">Your Office:</p>

      {dentalOffices.isFetchedAfterMount &&
        dentalOffices.data &&
        role.isFetchedAfterMount &&
        role.data?.roleInOffice === role.data?.roles && (
          <Office
            key={dentalOffices.data?.officeId}
            email=""
            id={dentalOffices.data?.id}
            name={dentalOffices.data?.name}
          />
        )}

      {dentalOffices.isLoading && (
        <LoaderIcon style={{ width: "100px", height: "100px" }} />
      )}

      {dentalOffices.isLoadingError && <p>You are not in an office</p>}

      {/* {dentalOffices.data === undefined || ( role.isFetchedAfterMount &&
        role.data?.roleInOffice === role.data?.roles) && <p>You are not in any offices</p>} */}
    </div>
  );
};

export default DentalStaff;
