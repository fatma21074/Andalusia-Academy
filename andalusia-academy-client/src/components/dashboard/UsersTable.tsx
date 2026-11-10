import type { AdminUser } from "../../types";
import { formatDate } from "../../utils/format";

export default function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">All registered users</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Created</th>
            <th scope="col">User ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td data-label="Name">
                {user.firstName} {user.lastName}
              </td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Role">{user.role}</td>
              <td data-label="Created">{formatDate(user.createdAt)}</td>
              <td data-label="User ID">{user.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
