import dayjs from "dayjs";
import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { BsFillTrashFill } from "react-icons/bs";
import LogModal from "~/components/LogModal";
import { api } from "~/utils/api";

const ActionLog = () => {
  const actions = api.officeRoute.getActions.useQuery();
  const clearActionLog = api.officeRoute.clearActionLog.useMutation({
    onSuccess: () => actions.refetch(),
  });
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    action: "",
    date: "",
    actionTaker: "",
  });


  //When we tap/click on a row, a modal will appear with the data of the row's action.
  const rowClickHandler = (
    _action: string,
    _date: string,
    _actionTaker: string
  ) => {
    setData({
      action: _action,
      date: _date,
      actionTaker: _actionTaker,
    });
    setOpen(true);
  };
  return (
    <div className="flex flex-col  items-center justify-center">
      <LogModal data={data} open={open} setOpen={setOpen} />
      <h1 className="mt-20 text-center text-xl font-bold">Action Log</h1>

      <button
        className="my-10 flex items-center justify-center gap-x-2 rounded-md border-2  border-red-700 px-4 py-2 text-red-700 transition duration-75 hover:bg-red-700 hover:text-white active:scale-97"
        onClick={() => {
          clearActionLog.mutate();
        }}
      >
        CLEAR ACTION LOG{" "}
        <BsFillTrashFill className="cursor-pointer text-lg  hover:scale-105 active:scale-110" />
      </button>

      <div className="">
        <table className="mx-auto  !w-[400px] overflow-scroll  text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              {/* <th scope="col" className="px-4 md:px-6 py-4">
                Id
              </th> */}
              <th scope="col" className="px-4 py-4  md:px-6">
                Time
              </th>
              <th scope="col" className="px-4 py-4 md:px-6">
                Person
              </th>
              <th scope="col" className="px-4 py-4 md:px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {actions.isLoading && (
                <td>
                  <LoaderIcon style={{ width: "30px", height: "30px" }} />
                </td>
              )}{" "}
            </tr>

            {actions.isFetched &&
              actions.data?.map((action) => {
                return (
                  <tr
                    onClick={() =>
                      rowClickHandler(
                        action.actionDescription,
                        dayjs(action.actionTime).format("MM-DD-YYYY hh:mm A"),
                        action.actionTakerId
                      )
                    }
                    className="cursor-pointer border-b hover:bg-slate-100 dark:border-neutral-500"
                    key={action.id}
                  >
                    {/* <td className="whitespace-nowrap truncate w-12 px-4 md:px-6 py-4 font-medium">
                      {action.id}
                    </td> */}
                    <td className="max-w-[100px] truncate px-4 py-4 md:max-w-full md:px-6">
                      {dayjs(action.actionTime).format("MM-DD-YYYY hh:mm A")}
                    </td>

                    <td className="px-4 py-4 md:px-6">
                      {action.actionTakerId}
                    </td>
                    <td className=" max-w-[220px] truncate px-4  py-4 md:max-w-full md:px-6">
                      {action.actionDescription}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActionLog;
