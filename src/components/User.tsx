import Link from "next/link";
import React from "react";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

type userPropsTypes = {
  name: string;
  roles: string;
  email: string;
  userId: string;

};

const User = ({
  name,
  roles,
  email,
  userId,
}: userPropsTypes) => {
  return (
    <div
      key={userId}
      className="flex   flex-col space-y-6 rounded-lg border border-black px-12 py-8"
    >
      <div className="flex items-center  justify-between">
        <p className="text-lg font-semibold">
          {name} 
        </p>
        <Link       href={`/console/${roles}/patient/${userId }`}
 className="text-blue-600 pl-12 hover:underline">
          {/* {appointmentApproved && "Has pending appointment"} */}
          Manage
        </Link>
      </div>
      <div className="flex  space-y-2 flex-col w-full">
        {email.length > 0 && (
          <a href={`mailto:${email}`} className="flex font-thin text-gray-500 hover:border-gray-500 border-b border-white   h-full   w-min items-center">
            {email} < AiOutlineMail className="ml-2 " />
          </a>
        )}


        {roles && (
          <p  className=" flex font-thin text-green-700  border-b border-white   w-min  items-center">
            {roles } 
          </p>
        )}
        {!roles &&  
            <div  className=" flex font-thin text-red-700  border-b border-white w-min    items-center">
            Missing <AiOutlinePhone className="ml-2" />
          </div>
        }
      </div>
    </div>
  );
};

export default User;
