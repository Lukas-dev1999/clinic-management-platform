/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import React from "react";
import FetchRole from "./fetchRole";

const GetArrRole = () => {
  const AvailableRoles = {
    SuperAdmin: 9,
    SystemAdmin: 8,
    TenantAdmin: 7,
    Owner: 6,
    Manager: 5,
    Dentist: 4,
    DentalHygienist: 3,
    DentalAssistant: 2,
    Patient: 1,
  };

  //Convert the object of into an array. [[key, value], [key, value]...]
  const asArray = Object.entries(AvailableRoles);

  //Get the current user's role
  const role = FetchRole();

  //Get the value of the user's role. SuperAdmin is strongest at 9 & Patient is weakest at 1.
  const valueOfRole = AvailableRoles[role];


  //Filter through the converted array to only keep the roles that are below the current user's roles in the hierarchy.
  const filtered = asArray.filter(([key, value]) => valueOfRole > value);
  const arrToReturn: string[] = [];

  //Push to an empty array the roles that are below the current user's role in the hierarchy.
  filtered.map(([key, value]) => arrToReturn.push(key));

  return arrToReturn;
};

export default GetArrRole;
