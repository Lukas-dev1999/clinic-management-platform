import { Fragment, useEffect, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";

import { api } from "~/utils/api";

type User = {
  id: string;
  name: string | null;
};

type ComboFieldProps = {
  setUser: React.Dispatch<React.SetStateAction<string>>;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ComboField({
  setUser,
}: ComboFieldProps) {
  const { data, isLoading, isError } =
    api.officeRoute.getAllUsers.useQuery();

  const users: User[] = data ?? [];

  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] =
    useState<User | null>(null);

  // Set first user automatically
  useEffect(() => {
    if (users.length > 0 && !selectedPerson) {
      setSelectedPerson(users[0]!);
    }
  }, [users, selectedPerson]);

  // Update parent state safely
  useEffect(() => {
    if (selectedPerson?.id) {
      setUser(selectedPerson.id);
    }
  }, [selectedPerson, setUser]);

  // Filter users
  const filteredPeople = useMemo(() => {
    if (!query) return users;

    return users.filter((person) =>
      person.name
        ?.toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query, users]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">
          Loading users...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
        <p className="text-sm text-red-600">
          Failed to load users.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Combobox
        value={selectedPerson}
        onChange={setSelectedPerson}
      >
        <Combobox.Label className="mb-2 block text-sm font-semibold text-gray-700">
          Assign User
        </Combobox.Label>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
            <Combobox.Input
              className="w-full border-none bg-transparent py-3 pl-4 pr-10 text-sm text-gray-900 outline-none focus:ring-0"
              displayValue={(person: User) =>
                person?.name ?? ""
              }
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search users..."
            />

            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition duration-100 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-gray-100 bg-white py-2 shadow-xl focus:outline-none">
              {filteredPeople.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No users found.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    value={person}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-pointer select-none px-4 py-3 transition",
                        active
                          ? "bg-sky-500 text-white"
                          : "text-gray-900"
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            "block truncate",
                            selected
                              ? "font-semibold"
                              : "font-medium"
                          )}
                        >
                          {person.name}
                        </span>

                        {selected && (
                          <span className="absolute inset-y-0 right-4 flex items-center">
                            <CheckIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}