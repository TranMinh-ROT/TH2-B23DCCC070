import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// --- Redux Setup ---
interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: [{ id: 1, name: '3', price: 2 }],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index >= 0) state.products[index] = action.payload;
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
  },
});

const { addProduct, updateProduct, deleteProduct } = productSlice.actions;

const store = configureStore({
  reducer: {
    product: productSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// --- Components ---
const Table: React.FC<{
  data: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ data, onEdit, onDelete }) => {
  const totalPrice = useMemo(() => data.reduce((sum, item) => sum + item.price, 0), [data]);

  return (
    <table>
      <thead>
        <tr>
          <th>Tên</th>
          <th>Giá</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>
              <button onClick={() => onEdit(item.id)}>Chỉnh sửa</button>
              <button onClick={() => onDelete(item.id)}>Xóa</button>
            </td>
          </tr>
        ))}
        <tr>
          <td>Tổng số</td>
          <td>{totalPrice}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

const SearchInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <input type="text" placeholder="Tìm kiếm..." value={value} onChange={onChange} />
);

// --- Pages ---
const ProductList: React.FC = () => {
  const [search, setSearch] = useState('');
  const products = useSelector((state: RootState) => state.product.products);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <button onClick={() => navigate('/add')}>Thêm Hàng Hóa</button>
      <SearchInput value={search} onChange={e => setSearch(e.target.value)} />
      <Table
        data={filteredProducts}
        onEdit={(id) => navigate(`/edit/${id}`)}
        onDelete={(id) => dispatch(deleteProduct(id))}
      />
    </div>
  );
};

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const products = useSelector((state: RootState) => state.product.products);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const existingProduct = products.find(p => p.id === Number(id));
  const [name, setName] = useState(existingProduct?.name || '');
  const [price, setPrice] = useState(existingProduct?.price || 0);

  const handleSubmit = () => {
    if (isEdit) {
      dispatch(updateProduct({ id: Number(id), name, price }));
    } else {
      dispatch(addProduct({ id: Date.now(), name, price }));
    }
    navigate('/');
  };

  return (
    <div>
      <h1>{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label>Tên: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Giá: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <button type="submit">Lưu</button>
        <button onClick={() => navigate('/')}>Hủy</button>
      </form>
    </div>
  );
};

// --- App Component ---
const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/add" element={<ProductForm />} />
        <Route path="/edit/:id" element={<ProductForm />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
