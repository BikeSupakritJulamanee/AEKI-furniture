import { useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";

function UserorderList() {
  const { user } = useUserAuth(); //firebase Auth

  useEffect(() => {
    console.log(user.email) // output is undefind
  })
  return (
    <>
    </>
  );
}
export default UserorderList

// I want to give user loaded information success before useEffect run