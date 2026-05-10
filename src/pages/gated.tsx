import { useState } from "react";
import Link from "next/link";

const Roles = {
  SuperAdmin: "SuperAdmin",
  SystemAdmin: "SystemAdmin",
  TenantAdmin: "TenantAdmin",
  Owner: "Owner",
  Manager: "Manager",
  Dentist: "Dentist",
  DentalHygienist: "DentalHygienist",
  DentalAssistant: "DentalAssistant",
  Patient: "Patient",
};

export default function GatedPage() {
  const [selectedRole, setSelectedRole] = useState("Dentist");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-black">
          Select Your Role
        </h1>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="mb-6 block w-full rounded-lg border border-gray-300 bg-white p-3 text-black"
        >
          {(Object.keys(Roles) as Array<keyof typeof Roles>).map((key) => {
            return (
              <option key={key} value={key}>
                {key}
              </option>
            );
          })}
        </select>

        <Link href={`/console/${selectedRole}`}>
          <button className="w-full rounded-lg bg-sky-500 p-3 text-lg font-semibold text-white transition hover:bg-sky-600">
            Enter Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}