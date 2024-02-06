import { useQuery } from "@tanstack/react-query";
import UserService from "../firebase/user";

export default function useCurrentUserQuery() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: UserService.fetchCurrentUser,
  });
}
