import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { actions } from "../../redux/slices/user";
import { getUserById } from "../../services/user.service";

function useUser() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const allUsersForSearch = useSelector((state) => state.allUsersForSearch);
  return {
    setUser: (user) => dispatch(actions.setUser(user)),
    setUsers: (users) => dispatch(actions.setUsers(users)),
    setAllUsersForSearch: (allUsersForSearch) =>
      dispatch(actions.setAllUsersForSearch(allUsersForSearch)),
    ...user,
    ...users,
    ...allUsersForSearch,
  };
}

export default function User() {
  const { user, setUser } = useUser();
  const { id } = useParams();

  const getUser = async () => {
    const res = await getUserById(id);
    const json = await res.json();
    setUser(json);
  };

  React.useEffect(() => {
    if (user?.id === undefined) {
      getUser();
    }
  }, []);

  return (
    <div className="user-page">
        <div className="navigation">
            <Link to="/" className="back-home">&lt;Back to Home</Link>
        </div>
      <h1>User</h1>
      <h2>{user?.email}</h2>
      <img key={user.avatar} src={user.avatar} />
                <p>
                <strong>{user.first_name}</strong>
                </p>

    </div>
  );
}
