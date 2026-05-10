import Link from "next/link";
import React from "react";
import FetchRole from "~/hooks/fetchRole";

type userPropsTypes = {
  name: string;
  id: string;
};

const Office = ({ name, id }: userPropsTypes) => {
  const role = FetchRole();
  return (
    <div
      key={id}
      className="group flex   w-72 flex-col  space-y-6 rounded-lg border border-black px-12 py-8"
    >
      <div className="flex flex-col items-start  justify-between gap-y-3">
        <p className="w-full truncate text-lg font-semibold  group-hover:whitespace-normal">
          {name}
        </p>
        <Link
          href={`/console/${role}/office/${id}`}
          className="text-blue-600  hover:underline"
        >
          {/* {appointmentApproved && "Has pending appointment"} */}
          Manage
        </Link>
      </div>
      {/* <div className="flex  space-y-2 flex-col w-full">
        {email.length > 0 && (
          <a href={`mailto:${email}`} className="flex font-thin text-gray-500 hover:border-gray-500 border-b border-white   h-full   w-min items-center">
            {email} < AiOutlineMail className="ml-2 " />
          </a>
        )}


        {roles && (
          <a href={`tel:${roles}`} className=" flex font-thin text-green-700 hover:border-green-700 border-b border-white   w-min  items-center">
            {roles } <AiOutlinePhone className="ml-2" />
          </a>
        )}
        {!roles &&  
            <div  className=" flex font-thin text-red-700  border-b border-white w-min    items-center">
            Missing <AiOutlinePhone className="ml-2" />
          </div>
        }
      </div> */}
    </div>
  );
};

export default Office;
