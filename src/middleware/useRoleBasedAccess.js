import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const useRoleBasedAccess = () => {
  const user = useSelector((state) => state.auth?.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Role-based routing after login
      if (user.role === "admin") {
        router.push("/admin");
        toast.success("Welcome Admin!");
      } else if (user.role === "user") {
        router.push("/user");
        toast.success("Welcome to your dashboard!");
      }
    } else if (!user) {
      // If not authenticated, redirect to login
      router.push("/login");
    }
  }, [user, router]);
};

export default useRoleBasedAccess;
