import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { LoaderIcon } from "react-hot-toast";
import { api } from "~/utils/api";

const PatientInfoPage = () => {
  const router = useRouter();
  const { patientId } = router.query;

  const self = api.officeRoute.getSelf.useQuery(patientId as string);

  const session = useSession();

  const role = api.officeRoute.getRole.useQuery({
    input: session.data?.user.id as string,
  });
  const dentalOffices = api.officeRoute.getJoinedOffices.useQuery();

  return (
    <div className="flex flex-col items-center justify-center gap-y-6 py-24">

      {/* If the dental offices are fetched, dental office data exists, the user's role is fetched,
       and the user's role in the office is the same as their selected role, render the dental office the user is in */}
      {dentalOffices.isFetchedAfterMount &&
        dentalOffices.data &&
        role.isFetchedAfterMount &&
        role.data?.roleInOffice === role.data?.roles && (
          <div>You are a patient at {dentalOffices.data.name}</div>
        )}

      {self.isLoading && (
        <LoaderIcon style={{ width: "100px", height: "100px" }} />
      )}

      {self.isFetched && (
        <div>
          <p>Name: {self.data?.name}</p>
          <p>E-Mail: {self.data?.email}</p>
          <p>ID: {self.data?.id}</p>
        </div>
      )}
    </div>
  );
};

export default PatientInfoPage;
