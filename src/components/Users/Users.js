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
  const pageData = useSelector((state) => state.pageData)
  const currentPage = useSelector((state) => state.currentPage)
  const loading = useSelector((state) => state.loading)
  const search = useSelector((state) => state.search)
  const allUsersForSearch = useSelector((state) => state.allUsersForSearch)
  return {
    setUser: (user) => dispatch(actions.setUser(user)),
    setUsers: (users) => dispatch(actions.setUsers(users)),
    setPageData: (pageData) => dispatch(actions.setPageData(pageData)),
    setCurrentPage: (currentPage) => dispatch(actions.setCurrentPage(currentPage)),
    setLoading: (loading) => dispatch(actions.setLoading(loading)),
    setSearch: (search) => dispatch(actions.setSearch(search)),
    setAllUsersForSearch: (allUsersForSearch) => dispatch(actions.setAllUsersForSearch(allUsersForSearch)),
    ...user,
    ...users,
    ...pageData,
    ...currentPage,
    ...loading,
    ...search,
    ...allUsersForSearch
  }
}

export default function Users() {
  const {
    users,
    pageData,
    currentPage,
    loading,
    allUsersForSearch,
    setUser,
    setUsers,
    setPageData,
    setCurrentPage,
    setLoading,
    setAllUsersForSearch
  } = useUser();

  const getUserList = async (page = currentPage, pageSize = 2) => {
    try {

        setLoading(true);

        const res = await getUsers(page, pageSize);
        const json = await res.json();

        setLoading(false);

        return json;
      
    } catch (error) {
      alert(error);
    }
  };

  React.useEffect(() => {
      getUserList().then((json) => {
        setUsers(json.data);
        setPageData(json);
        if (allUsersForSearch.data === undefined) {
          // API SERVICE hasn't search functionality so we need to store all users in redux store
          getUserList(1, json.total).then((json) => {
            setAllUsersForSearch(json);
          })
        }
      });
  }, [currentPage]);

  return (
    <div className="flex App">
      <h1>User List</h1>
      <SearchBar />
      <div className="flex">
        {loading ? (
          <div className="loader"></div>
        ) : (
          users?.map((user) => {
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
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

function PaginationBar({ pageData, setCurrentPage }) {
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
      <button onClick={() => setCurrentPage(1)} disabled={pageData.page === 1}>
        &lt;&lt;
      </button>
      <button
        onClick={() => setCurrentPage(pageData.page - 1)}
        disabled={pageData.page === 1}
      >
        &lt;
      </button>

      {paginationBar(pageData.page, pageData.total_pages).map((number) => (
        <button
          className={pageData.page == number ? "active" : ""}
          key={number}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(pageData.page + 1)}
        disabled={pageData.page === pageData.total_pages}
      >
        &gt;
      </button>
      <button
        onClick={() => setCurrentPage(pageData.total_pages)}
        disabled={pageData.page === pageData.total_pages}
      >
        &gt;&gt;
      </button>
    </>
  );
}

function SearchBar() {
  const [searchInput, setSearchInput] = React.useState("");
  const [userWarn, setUserWarn] = React.useState(false);
  const { setSearch, allUsersForSearch, setUsers, users, pageData, search } = useUser();

  function onChangeHandler(e) {
    setSearchInput(e.target.value);
  }

  React.useEffect(() => {
    if (search.length >= 3) {
      const filteredUsers = allUsersForSearch.data.filter((user) => user.email.includes(search) ? user : null);
      setUsers(filteredUsers);
    } else if (search.length === 0) {
      setUsers(pageData.data);
    }
  }, [search]);

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

