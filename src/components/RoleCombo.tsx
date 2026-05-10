/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/*
  This officeRoute requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

type usersType = {
  setRole: React.Dispatch<React.SetStateAction<string>>;
  roles: string[];
};

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function RoleCombo({ setRole, roles }: usersType) {
  const roleRef = useRef(false);
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState();


  //Update selected role on inital fetch
  useEffect(() => {
    if (roles.length !== 0 && !roleRef.current) {
      roleRef.current = true;
      setSelectedRole(roles[0]);
    }
  }, [roles]);


  //When the selected role on the combo box is changed, update the selected role on the form.
  useEffect(() => {
    setRole(selectedRole);
  }, [selectedRole, setRole]);

  const filteredPeople =
    query === ""
      ? roles
      : roles.filter((role) => {
          return role?.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selectedRole} onChange={setSelectedRole}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
        Role
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-2 border-babyblue bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm  ring-inset ring-gray-300  focus:ring-inset focus:ring-babyblue sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => selectedRole}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredPeople?.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople?.map((role) => (
              <Combobox.Option
                key={role}
                value={role}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-babyblue text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {role}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-babyblue"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
