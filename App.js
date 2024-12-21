import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import "./App.css"; // CSS file for styling

// Redux Slice for Goods Management
const goodsSlice = createSlice({
  name: "goods",
  initialState: [],
  reducers: {
    addGood: (state, action) => {
      state.push(action.payload);
    },
  },
});

const { addGood } = goodsSlice.actions;
const store = configureStore({
  reducer: {
    goods: goodsSlice.reducer,
  },
});

// Sidebar Component
function Sidebar() {
  return (
    <div style={{ backgroundColor: "#333", color: "white", height: "100vh", padding: "20px" }}>
      <h3>Hướng dẫn</h3>
      <button
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Quản lý hàng hóa
      </button>
    </div>
  );
}

// GoodsList Component
function GoodsList() {
  const goods = useSelector((state) => state.goods);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(goods.length / itemsPerPage);
  const paginatedGoods = goods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2>Danh Sách Hàng Hóa</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tìm kiếm hàng..."
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>
      {goods.length === 0 ? (
        <p>Không tìm thấy hàng hóa nào!</p>
      ) : (
        <ul>
          {paginatedGoods.map((good, index) => (
            <li key={index}>
              {good.name} - {good.price} VNĐ
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/add")}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          Thêm Hàng Hóa
        </button>
      </div>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
            color: currentPage === 1 ? "#666" : "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: currentPage === totalPages || totalPages === 0 ? "#ccc" : "#007bff",
            color: currentPage === totalPages || totalPages === 0 ? "#666" : "white",
            cursor: currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
          }}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

// AddGood Component
function AddGood() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    if (name && price) {
      dispatch(addGood({ name, price }));
      navigate("/");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Thêm Hàng Hóa</h2>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Tên Hàng Hóa:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Giá Hàng Hóa:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        style={{ backgroundColor: "blue", color: "white", padding: "10px 20px", borderRadius: "5px" }}
      >
        Thêm
      </button>
      <button
        onClick={() => navigate("/")}
        style={{ marginLeft: "10px", padding: "10px 20px", borderRadius: "5px", backgroundColor: "#ccc" }}
      >
        Quay lại
      </button>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Router>
            <Routes>
              <Route path="/" element={<GoodsList />} />
              <Route path="/add" element={<AddGood />} />
            </Routes>
          </Router>
        </div>
      </div>
    </Provider>
  );
}

// Render App
ReactDOM.render(<App />, document.getElementById("root"));
export default App;
