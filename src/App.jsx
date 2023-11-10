import React, { useEffect, useState } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtnGroup,
  MDBBtn,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
const App = () => {
  const [data, setData] = useState([]);
  const [Value, setValue] = useState("");
  const [SortValue, setSortValue] = useState("");
  const [currentPage, setcurrentPage] = useState(0);
  const [pageLimit] = useState(4);

  const sortOptions = ["name", "adress", "email", "status"];

  useEffect(() => {
    loadUserData(0, 4, 0);
  }, []);
  //!GET
  const loadUserData = async (start, end, increase) => {
    const res = await fetch(
      `http://localhost:4000/users?_start=${start}&_end=${end}`
    ); //!4 tane göster
    const json = await res.json();
    setData(json);
    setcurrentPage(prevPage => prevPage + increase);
  };
  const handleReset = () => {
    loadUserData(0, pageLimit, 0); // Tüm verileri yükleyerek sayfa başına dön
    setSortValue(""); // Sıralama değerini sıfırla
    setValue(""); // Arama değerini sıfırla
    setcurrentPage(0); 
  };
  //!SEARCH
  const handleSearch = async (e) => {
    e.preventDefault();
    const trimValue = Value.trim();
    const response = await fetch(
      `http://localhost:4000/users?_start=${currentPage * pageLimit}&_end=${(currentPage + 1) * pageLimit}`
    );
  
    const json = await response.json();
    const filteredData = json.filter(item =>
      item.name.toLowerCase().startsWith(trimValue.toLowerCase()) ||
      item.email.toLowerCase().startsWith(trimValue.toLowerCase())
    );
  
    setData(filteredData);
    setValue("");
  };

  //!SORT
  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    const response = await fetch(
      `http://localhost:4000/users?_sort=${value}&_order=asc`
    );
    const json = await response.json();
    setData(json);
  };

  //!ACTİVEBUTTON
  const handleFilter = async (value) => {
    const response = await fetch(`http://localhost:4000/users?status=${value}`);
    const json = await response.json();
    setData(json);
  };

  //!pagelimit
  const renderPagination = () => {
    if (currentPage === 0) {
      return (
        <MDBPagination>
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUserData(4, 8, 1)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData((currentPage - 1) * 4, currentPage * 4, -1)
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData((currentPage + 1) * 4, (currentPage + 2) * 4, 1)
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUserData(4, 8, -1)}>Prev</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return (
    <MDBContainer>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          name=""
          id=""
          className="form-control"
          placeholder="Search Name..."
          value={Value}
          onChange={(e) => setValue(e.target.value)}
        />
        <MDBBtn type="submit" color="dark">
          Search
        </MDBBtn>
        <MDBBtn color="info" className="mx-2" onClick={() => handleReset()}>
          Reset
        </MDBBtn>
      </form>
      <div>
        <h2 className="text-center mt-5">Search,Filter,Sort and Pagination</h2>
        <MDBRow>
          <MDBCol size={12}>
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Name.</th>
                  <th scope="col">Email.</th>
                  <th scope="col">Address.</th>
                  <th scope="col">Status.</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className="align-items-center mb-0">
                  <tr>
                    <td colSpan={8} className="text-center mb-0">
                      No Data Found
                    </td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.adress}</td>
                      <td>{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </div>
      <div>{renderPagination()}</div>
      <MDBRow>
        <MDBCol size={8}>
          <h5>Sort By:</h5>{" "}
          <select
            style={{ width: "50%", borderRadius: "2px", height: "35px" }}
            onChange={handleSort}
            value={SortValue}
          >
            <option>Please Select Value</option>
            {sortOptions.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </MDBCol>
        <MDBCol size={4}>
          <h5>Filter By Status</h5>
          <MDBBtnGroup className="flex gap-2">
            <MDBBtn color="success" onClick={() => handleFilter("Active")}>
              Active
            </MDBBtn>
            <MDBBtn color="danger" onClick={() => handleFilter("Inactive")}>
              InActive
            </MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default App;
