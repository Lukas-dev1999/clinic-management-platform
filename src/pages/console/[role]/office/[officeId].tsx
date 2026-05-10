/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { api } from "~/utils/api";
import ComboField from "~/components/Combobox";
import Link from "next/link";
import FetchRole from "~/hooks/fetchRole";
import { BsFillTrashFill } from "react-icons/bs";
import GetArrRole from "~/hooks/getArrRole";
import RoleCombo from "~/components/RoleCombo";
import { AiOutlineUserAdd } from "react-icons/ai";

const officeRoles = [
  "Owner",
  "Manager",
  "Dentist",
  "DentalHygienist",
  "DentalAssistant",
  "Patient",
];

const OfficePage = () => {
  //arrToReturn is the list of roles that are below the current user's role in the hierarchy.
  const arrToReturn = GetArrRole();

  const router = useRouter();
  const { officeId } = router.query;

  const allUsers = api.officeRoute.getAllUsers.useQuery();

  //The ID of the user that was successfully removed from or added to the office
  const [interactedUserId, setInteractedUserId] = useState("");

  const [userId, setSelectedUserId] = useState("");
  const [role, setSelectedRole] = useState(officeRoles[0] as string);

  const office = api.officeRoute.getOffice.useQuery(officeId as string);
  const viewerRole = FetchRole();

  useEffect(() => {
    if (allUsers.isFetched) {
      setSelectedUserId(allUsers?.data?.at(0)?.id as string);
    }
  }, [allUsers?.data, allUsers.isFetched]);

  const addToTable = api.officeRoute.addToTable.useMutation();

  const deleteOffice = api.officeRoute.deleteOffice.useMutation({
    onSuccess: () => {
      addToTable.mutate(`Deleted office named ${office.data?.name}`);
      void router.replace("/console/SystemAdmin/office");
    },
  });

  const userInteractedHandler = (dataId: string) => {
    setInteractedUserId(dataId);
  };

  const addUserToOffice = api.officeRoute.addUserToOffice.useMutation({
    onSuccess: () => {
      toast.success("User Added to an Office");
      void office.refetch();
      addToTable.mutate(
        `Added #${interactedUserId}# to an office named ${office.data?.name}`
      );
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const removeUserFromOffice = api.officeRoute.removeUserFromOffice.useMutation(
    {
      onSuccess: () => {
        toast.success("User Removed From Office");
        void office.refetch();
        addToTable.mutate(
          `Removed #${interactedUserId}# from office named ${office.data?.name}`
        );
      },
    }
  );
  return (
    <div className="mx-auto flex max-w-7xl flex-col justify-center gap-y-16 py-24">
      {viewerRole === "SuperAdmin" && (
        <button
          className="mx-auto flex w-48 items-center justify-center gap-x-2 rounded-md border-2 border-red-700 px-4 py-2 text-red-700 hover:bg-red-700 hover:text-white"
          onClick={() => deleteOffice.mutate(officeId as string)}
        >
          DELETE OFFICE{" "}
          <BsFillTrashFill className="cursor-pointer text-lg  hover:scale-105 active:scale-110" />
        </button>
      )}
      <div className="mx-auto flex items-center gap-x-4 text-center text-2xl font-bold">
        Welcome to{" "}
        {office && office.data?.name}
        {(office.isLoading || addUserToOffice.isLoading || removeUserFromOffice.isLoading) && (
          <LoaderIcon style={{ minWidth: "20px", minHeight: "20px" }} />
        )}
        {deleteOffice.isLoading && (
          <p className="mx-auto text-center">
            <LoaderIcon />
          </p>
        )}
      </div>

      <div className="mx-auto flex flex-col gap-x-8 gap-y-4 md:flex-row md:items-end">
        <RoleCombo
          setRole={setSelectedRole}
          roles={
            viewerRole !== "SuperAdmin" && viewerRole !== "SystemAdmin"
              ? arrToReturn
              : officeRoles
          }
        />
        <ComboField setUser={setSelectedUserId} />

        <button
          onClick={() => {
            addUserToOffice.mutate({
              officeId: officeId as string,
              role,
              userId,
            });

            userInteractedHandler(userId);
          }}
          className="tranition flex h-10 items-center justify-center gap-x-2 whitespace-nowrap rounded-md border-2 border-babyblue px-4 py-2 text-babyblue duration-75 hover:bg-babyblue hover:text-white active:scale-97"
        >
          Add user to office <AiOutlineUserAdd />
        </button>
      </div>

      <div className="mx-auto flex  flex-col flex-wrap gap-x-4 gap-y-12 md:flex-row">
        {officeRoles.map((key) => {
          return (
            <div className="" key={key}>
              <div className="flex flex-col ">
                <p className="mb-2   text-lg underline underline-offset-4">
                  {key}s
                </p>
                {office.data?.users.map((user) => (
                  <>
                    {user.roleInOffice === key && (
                      <div className="flex  items-center gap-x-2" key={user.id}>
                        <Link
                          href={`/console/${viewerRole}/patient/${user.id}`}
                          key={user.id}
                          className=" max-w-[4rem] truncate  font-thin"
                        >
                          {user.name}
                        </Link>
                        {(viewerRole === "SystemAdmin" ||
                          viewerRole === "TenantAdmin" ||
                          viewerRole === "SuperAdmin") && (
                          <BsFillTrashFill
                            onClick={() => {
                              removeUserFromOffice.mutate({
                                officeId: officeId as string,
                                role: key,
                                userId: user.id,
                              });

                              userInteractedHandler(user.id);
                            }}
                            className="cursor-pointer text-lg text-red-700 hover:scale-105 active:scale-110"
                          />
                        )}
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfficePage;
