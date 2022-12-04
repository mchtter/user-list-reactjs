import * as React from "react";
import { getUsers } from "../../services/user.service";
import "../../assets/css/style.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../redux/slices/user";

function useUser() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const loading = useSelector((state) => state.loading)
  const allUsersForSearch = useSelector((state) => state.allUsersForSearch)
  return {
    setUser: (user) => dispatch(actions.setUser(user)),
    setUsers: (users) => dispatch(actions.setUsers(users)),
    setLoading: (loading) => dispatch(actions.setLoading(loading)),
    setAllUsersForSearch: (allUsersForSearch) => dispatch(actions.setAllUsersForSearch(allUsersForSearch)),
    ...user,
    ...users,
    ...loading,
    ...allUsersForSearch
  }
}

export default function Users() {
  const { users, loading, setUser, setUsers, setLoading} = useUser();

  const [pageData, setPageData] = React.useState({});

  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(2);

  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");

  const userList = async (email) => {
    setLoading(true);
    const res = await getUsers(pageNumber, pageSize);
    const json = await res.json();
    if (email !== "" && email !== undefined) {
      const filteredUsers = json.data.filter((user) => user.email.includes(email));
      setUsers(filteredUsers);
    } else {
      setUsers(json.data);
    }
    
    setPageData(json);
    setLoading(false);
  };

  React.useEffect(() => {
    if (search?.length >= 3) {
      setPageSize(pageData.total);
      setPageNumber(1);
      userList(search);
    } else if (search?.length < 3) {
      setPageSize(2);
      setPageNumber(1);
      userList();
    } else if (users === {}) {
      userList();
    }
  }, [pageNumber, search]);

  return (
    <div className="flex App">
      <h1>User List</h1>
      <SearchBar 
        searchInput={searchInput} 
        setSearchInput={setSearchInput} 
        setSearch={setSearch}
      />
      <div className="flex">
        {loading ? (
          <div className="loader"></div>
        ) : (
          users.map((user) => {
            return (
              <div className="card" key={user.id}>
                <img key={user.avatar} src={user.avatar} />
                <p>
                    <Link to={`/user/${user.id}`} onClick={() => setUser(user)}><strong>{user.first_name}</strong></Link>
                </p>
                <p>{user.email}</p>
              </div>
            );
          })
        )}
      </div>
      <div className="flex pagination-bar">
        <PaginationBar 
          pageData={pageData} 
          setPageNumber={setPageNumber} 
        />
      </div>
    </div>
  );
}

function PaginationBar({ pageData, setPageNumber }) {
  const allPages = [];
  let totalElements = 5
  for (let i = 1; i <= pageData.total_pages; i++) {
    allPages.push(i);
  }


  const paginationBar = (page, totalPages) => {
    if (allPages.length <= totalElements) {
      return allPages;
    }

    let left = []
    let right = []
    let pages = []

    for (let i = 1; i < page; i++) {
      left.push(i)
    }
    for (let i = page + 1; i <= totalPages; i++) {
      right.push(i)
    }

    pages.push(page)

    totalElements--;

    while (totalElements > 0) {
      if (left.length > 0) {
        pages.push(left.pop())
        totalElements--
      }
      if (right.length > 0) {
        pages.push(right.shift())
        totalElements--
      }
    }

    return pages.sort((a, b) => a - b)
  }

  return (
    <>
      <button onClick={() => setPageNumber(1)} disabled={pageData.page === 1}>
        &lt;&lt;
      </button>
      <button
        onClick={() => setPageNumber(pageData.page - 1)}
        disabled={pageData.page === 1}
      >
        &lt;
      </button>

      {paginationBar(pageData.page, pageData.total_pages).map((number) => (
        <button
          className={pageData.page == number ? "active" : ""}
          key={number}
          onClick={() => setPageNumber(number)}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => setPageNumber(pageData.page + 1)}
        disabled={pageData.page === pageData.total_pages}
      >
        &gt;
      </button>
      <button
        onClick={() => setPageNumber(pageData.total_pages)}
        disabled={pageData.page === pageData.total_pages}
      >
        &gt;&gt;
      </button>
    </>
  );
}

function SearchBar({ searchInput, setSearchInput, setSearch }) {
  const [userWarn, setUserWarn] = React.useState(false);
  function onChangeHandler(e) {
    setSearchInput(e.target.value);
  }

  return (
    <div>
      <input
        className="search-bar"
        type="text"
        placeholder="Search (Min 3 characters)"
        value={searchInput}
        onKeyDown={(e) => {
          if (e.target.value.length >= 3) {
            setUserWarn(true);
          } else {
            setUserWarn(false);
          }
          if (e.key === "Enter" && searchInput.length >= 3) {
              setSearch(searchInput);
          } else {
              setSearch("");
          }
        }}
        onChange={onChangeHandler}
      />
      <p className="warn">{userWarn ? 'Press "Enter" to search' : ""}</p>
    </div>
  );
}

