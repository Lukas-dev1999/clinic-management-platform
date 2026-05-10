import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

const FetchRole = () => {
  //Felt as though I would be fetching the user role many times so I turned it into a function.
  const session = useSession();

  return api.officeRoute.getRole.useQuery({
    input: session.data?.user.id as string,
  }).data?.roles as string;
};

export default FetchRole;
