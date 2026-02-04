import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function UserLayout({ user, children }) {
  return (
    <>
      <UserHeader user={user} />
      <main className="container my-4">
        {children}
      </main>
      <UserFooter />
    </>
  );
}

export default UserLayout;
