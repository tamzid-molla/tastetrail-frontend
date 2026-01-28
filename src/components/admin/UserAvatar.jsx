import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ user, size = "default" }) => {
  const sizeClasses = {
    default: "h-8 w-8",
    sm: "h-6 w-6",
    lg: "h-10 w-10"
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.photo || ""} alt={user.name} />
      <AvatarFallback>
        {user.name?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;