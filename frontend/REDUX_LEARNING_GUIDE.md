# Redux 购物车实现 - 学习指南

## 📚 目录
1. [整体架构](#整体架构)
2. [数据流程](#数据流程)
3. [文件结构](#文件结构)
4. [核心概念](#核心概念)
5. [代码对比](#代码对比)
6. [实际应用](#实际应用)

---

## 🏗️ 整体架构

```mermaid
graph TB
    subgraph "React 应用"
        A[main.jsx<br/>Redux Provider] --> B[App.jsx]
        B --> C[Header 组件]
        B --> D[Home 页面]
        B --> E[ProductDetail 页面]
        B --> F[Cart 页面]
        
        D --> G[ProductList]
        G --> H[ProductItem]
    end
    
    subgraph "Redux Store"
        I[store.js<br/>配置中心] --> J[cartSlice.js<br/>购物车状态管理]
        J --> K[State<br/>购物车数据]
        J --> L[Reducers<br/>修改数据的函数]
        J --> M[Actions<br/>操作指令]
        J --> N[Selectors<br/>读取数据的函数]
    end
    
    C -.读取数据.-> N
    H -.读取数据.-> N
    E -.读取数据.-> N
    F -.读取数据.-> N
    
    H -.发送操作.-> M
    E -.发送操作.-> M
    F -.发送操作.-> M
    
    M --> L
    L --> K
    K --> N
    
    style I fill:#e1f5ff
    style J fill:#fff4e1
    style K fill:#ffe1e1
    style A fill:#e1ffe1
```

---

## 🔄 数据流程图

### 1. 添加商品到购物车的完整流程

```mermaid
sequenceDiagram
    participant User as 用户
    participant Component as ProductItem 组件
    participant Dispatch as useDispatch
    participant Action as addToCart Action
    participant Reducer as Cart Reducer
    participant State as Redux State
    participant Selector as useSelector
    participant UI as UI 更新
    
    User->>Component: 点击 "Add" 按钮
    Component->>Dispatch: dispatch(addToCart({product, quantity: 1}))
    Dispatch->>Action: 创建 action 对象
    Action->>Reducer: 传递 action 到 reducer
    
    alt 商品已存在
        Reducer->>State: 增加现有商品数量
    else 新商品
        Reducer->>State: 添加新商品到数组
    end
    
    Reducer->>State: 保存到 localStorage
    State->>Selector: state 更新
    Selector->>Component: 返回新的数量
    Component->>UI: 重新渲染（显示数量控制器）
    
    Note over State,Selector: Header 也会自动更新徽章数字
```

### 2. Redux vs Context API 数据流对比

```mermaid
graph LR
    subgraph "Context API 方式（旧）"
        A1[组件] --> B1[useCart Hook]
        B1 --> C1[CartContext]
        C1 --> D1[useState]
        D1 --> E1[所有消费者重新渲染]
    end
    
    subgraph "Redux 方式（新）"
        A2[组件] --> B2[useDispatch/useSelector]
        B2 --> C2[Redux Store]
        C2 --> D2[Reducer]
        D2 --> E2[只有相关组件重新渲染]
    end
    
    style E1 fill:#ffcccc
    style E2 fill:#ccffcc
```

---

## 📁 文件结构变化

### 新增文件

```
src/
├── store/                          # 🆕 Redux 相关文件
│   ├── store.js                   # 🆕 Redux store 配置
│   └── cartSlice.js               # 🆕 购物车 slice
│
├── context/
│   ├── AuthContext.jsx            # ✅ 保留（用户认证）
│   └── CartContext.jsx            # ⚠️ 可以删除（已被 Redux 替代）
│
├── assets/components/
│   ├── Header/
│   │   └── index.jsx              # 🔄 修改（使用 Redux）
│   └── Products/
│       └── ProductItem.jsx        # 🔄 修改（使用 Redux）
│
├── pages/
│   ├── Cart.jsx                   # 🔄 修改（使用 Redux）
│   └── ProductDetail.jsx          # 🔄 修改（使用 Redux）
│
└── main.jsx                       # 🔄 修改（使用 Redux Provider）
```

---

## 🎯 核心概念详解

### 1. Redux Store（仓库）

```mermaid
graph TB
    A[Redux Store] --> B[存储所有应用状态]
    A --> C[提供 dispatch 方法]
    A --> D[提供 getState 方法]
    A --> E[允许订阅状态变化]
    
    style A fill:#4CAF50,color:#fff
```

**代码示例：**
```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,  // 购物车状态
    // 未来可以添加更多：
    // auth: authReducer,
    // products: productsReducer,
  },
});
```

---

### 2. Slice（切片）

```mermaid
graph LR
    A[Slice] --> B[State 初始状态]
    A --> C[Reducers 修改函数]
    A --> D[Actions 自动生成]
    A --> E[Selectors 读取函数]
    
    style A fill:#2196F3,color:#fff
```

**Slice 包含什么？**

```javascript
// store/cartSlice.js
const cartSlice = createSlice({
  name: 'cart',                    // 1️⃣ 名称
  initialState: { items: [] },     // 2️⃣ 初始状态
  reducers: {                      // 3️⃣ Reducers
    addToCart: (state, action) => {
      // 修改 state 的逻辑
    },
    updateQuantity: (state, action) => {
      // 修改 state 的逻辑
    },
  },
});

// 4️⃣ 导出 Actions（自动生成）
export const { addToCart, updateQuantity } = cartSlice.actions;

// 5️⃣ 导出 Selectors（手动编写）
export const selectCartItems = (state) => state.cart.items;

// 6️⃣ 导出 Reducer
export default cartSlice.reducer;
```

---

### 3. Actions（动作）

```mermaid
graph LR
    A[Action] --> B[type: 动作类型]
    A --> C[payload: 携带的数据]
    
    style A fill:#FF9800,color:#fff
```

**Action 的结构：**

```javascript
// 当你调用：
dispatch(addToCart({ product, quantity: 1 }))

// Redux 会创建这样的 action 对象：
{
  type: 'cart/addToCart',           // 自动生成的类型
  payload: {                        // 你传入的数据
    product: { id: 1, name: '...', price: 99 },
    quantity: 1
  }
}
```

---

### 4. Reducers（归约器）

```mermaid
graph LR
    A[旧 State] --> B[Reducer 函数]
    C[Action] --> B
    B --> D[新 State]
    
    style B fill:#9C27B0,color:#fff
```

**Reducer 的工作原理：**

```javascript
// Reducer 是纯函数：(state, action) => newState
reducers: {
  addToCart: (state, action) => {
    const { product, quantity } = action.payload;
    const existingItem = state.items.find(item => item.id === product.id);
    
    if (existingItem) {
      // 商品已存在，增加数量
      existingItem.quantity += quantity;
    } else {
      // 新商品，添加到数组
      state.items.push({ ...product, quantity });
    }
    
    // Redux Toolkit 使用 Immer，可以直接修改 state
    // 实际上会创建新的不可变对象
  },
}
```

---

### 5. Selectors（选择器）

```mermaid
graph LR
    A[完整 State] --> B[Selector 函数]
    B --> C[提取需要的数据]
    C --> D[返回给组件]
    
    style B fill:#00BCD4,color:#fff
```

**Selector 的作用：**

```javascript
// 简单 selector
export const selectCartItems = (state) => state.cart.items;

// 计算型 selector
export const selectCartTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

// 参数化 selector
export const selectItemQuantity = (productId) => (state) => {
  const item = state.cart.items.find(item => item.id === productId);
  return item ? item.quantity : 0;
};
```

---

## 🔄 代码对比：Context API vs Redux

### 方式 1：Context API（旧方式）

```javascript
// ❌ 旧方式：使用 Context API

// 1. 创建 Context
const CartContext = createContext();

// 2. 创建 Provider
function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (product, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 3. 在组件中使用
function ProductItem({ product }) {
  const { addToCart } = useCart();  // 自定义 hook
  
  const handleAdd = () => {
    addToCart(product, 1);
  };
  
  return <button onClick={handleAdd}>Add</button>;
}
```

### 方式 2：Redux（新方式）

```javascript
// ✅ 新方式：使用 Redux

// 1. 创建 Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
    },
  },
});

export const { addToCart } = cartSlice.actions;

// 2. 配置 Store
const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

// 3. 在组件中使用
function ProductItem({ product }) {
  const dispatch = useDispatch();  // Redux hook
  
  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };
  
  return <button onClick={handleAdd}>Add</button>;
}
```

---

## 📊 组件使用示例

### 1. Header 组件 - 读取购物车数量

```mermaid
graph LR
    A[Header 组件] --> B[useSelector]
    B --> C[selectCartTotalItems]
    C --> D[Redux State]
    D --> E[返回总数量]
    E --> F[显示徽章]
    
    style B fill:#4CAF50,color:#fff
    style C fill:#2196F3,color:#fff
```

**代码：**
```javascript
import { useSelector } from "react-redux";
import { selectCartTotalItems } from "../../../store/cartSlice";

function Header() {
  // 📖 读取数据：使用 useSelector
  const totalItems = useSelector(selectCartTotalItems);
  
  return (
    <div className="cart-icon-wrapper">
      <MdOutlineShoppingCart className="cart-icon" />
      {totalItems > 0 && (
        <span className="cart-badge">{totalItems}</span>
      )}
    </div>
  );
}
```

---

### 2. ProductItem 组件 - 添加商品

```mermaid
graph LR
    A[ProductItem 组件] --> B[useDispatch]
    A --> C[useSelector]
    
    B --> D[dispatch action]
    D --> E[Redux Store]
    
    C --> F[selectItemQuantity]
    F --> E
    E --> G[返回数量]
    
    style B fill:#FF9800,color:#fff
    style C fill:#4CAF50,color:#fff
```

**代码：**
```javascript
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity, selectItemQuantity } from "../../../store/cartSlice";

function ProductItem({ product }) {
  // 📤 发送操作：使用 useDispatch
  const dispatch = useDispatch();
  
  // 📖 读取数据：使用 useSelector
  const quantity = useSelector(selectItemQuantity(product.id));
  
  const handleAdd = () => {
    // 发送 action
    dispatch(addToCart({ product, quantity: 1 }));
  };
  
  const handleIncrement = () => {
    dispatch(updateQuantity({ 
      productId: product.id, 
      quantity: quantity + 1 
    }));
  };
  
  return (
    <div>
      {quantity === 0 ? (
        <button onClick={handleAdd}>Add</button>
      ) : (
        <div>
          <button onClick={handleDecrement}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrement}>+</button>
        </div>
      )}
    </div>
  );
}
```

---

### 3. Cart 页面 - 管理购物车

```mermaid
graph TB
    A[Cart 组件] --> B[useSelector 读取数据]
    A --> C[useDispatch 发送操作]
    
    B --> D[selectCartItems]
    B --> E[selectCartTotalItems]
    B --> F[selectCartTotalPrice]
    
    C --> G[updateQuantity]
    C --> H[removeFromCart]
    
    style B fill:#4CAF50,color:#fff
    style C fill:#FF9800,color:#fff
```

**代码：**
```javascript
import { useDispatch, useSelector } from "react-redux";
import { 
  selectCartItems, 
  selectCartTotalItems, 
  selectCartTotalPrice,
  updateQuantity,
  removeFromCart 
} from "../store/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  
  // 📖 读取多个数据
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  
  // 📤 定义操作函数
  const handleIncrement = (productId, currentQuantity) => {
    dispatch(updateQuantity({ 
      productId, 
      quantity: currentQuantity + 1 
    }));
  };
  
  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };
  
  return (
    <div>
      <h1>Cart ({totalItems})</h1>
      {cartItems.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>{item.quantity}</span>
          <button onClick={() => handleIncrement(item.id, item.quantity)}>
            +
          </button>
          <button onClick={() => handleRemove(item.id)}>
            Remove
          </button>
        </div>
      ))}
      <div>Total: ${totalPrice.toFixed(2)}</div>
    </div>
  );
}
```

---

## 🎓 关键学习点

### 1. Redux 的三大原则

```mermaid
graph TB
    A[Redux 三大原则] --> B[单一数据源<br/>Single Source of Truth]
    A --> C[State 是只读的<br/>State is Read-Only]
    A --> D[使用纯函数修改<br/>Changes with Pure Functions]
    
    B --> B1[整个应用的 state<br/>存储在一个对象树中]
    C --> C1[唯一改变 state 的方法<br/>是发送 action]
    D --> D1[Reducer 必须是纯函数<br/>相同输入产生相同输出]
    
    style A fill:#FF5722,color:#fff
```

### 2. 数据流向（单向数据流）

```mermaid
graph LR
    A[用户交互] --> B[dispatch Action]
    B --> C[Reducer 处理]
    C --> D[更新 State]
    D --> E[UI 重新渲染]
    E -.用户看到变化.-> A
    
    style A fill:#4CAF50,color:#fff
    style E fill:#2196F3,color:#fff
```

### 3. Redux Toolkit 的优势

```mermaid
mindmap
  root((Redux Toolkit))
    简化配置
      configureStore
      自动集成 DevTools
      默认中间件
    减少样板代码
      createSlice
      自动生成 actions
      Immer 集成
    最佳实践
      推荐的项目结构
      TypeScript 支持
      异步逻辑处理
```

---

## 🔍 调试技巧

### 使用 Redux DevTools

```mermaid
graph TB
    A[Redux DevTools] --> B[查看 Action 历史]
    A --> C[查看 State 变化]
    A --> D[时间旅行调试]
    A --> E[导出/导入 State]
    
    B --> B1[每个 action 的详情]
    C --> C1[Diff 视图]
    D --> D1[回退到任意时刻]
    E --> E1[分享调试状态]
    
    style A fill:#9C27B0,color:#fff
```

**如何使用：**
1. 安装 Redux DevTools 浏览器扩展
2. 打开浏览器开发者工具
3. 切换到 "Redux" 标签
4. 查看所有 dispatched actions 和 state 变化

---

## 📝 总结

### Redux 工作流程总览

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 组件
    participant D as Dispatch
    participant R as Reducer
    participant S as Store
    participant SE as Selector
    
    U->>C: 点击按钮
    C->>D: dispatch(action)
    D->>R: 传递 action
    R->>R: 计算新 state
    R->>S: 更新 state
    S->>SE: state 变化
    SE->>C: 返回新数据
    C->>U: UI 更新
    
    Note over R,S: Redux Toolkit<br/>使用 Immer<br/>可以"直接修改" state
```

### 核心 API 速查

| API | 用途 | 示例 |
|-----|------|------|
| `useSelector` | 从 Redux store 读取数据 | `const items = useSelector(selectCartItems)` |
| `useDispatch` | 获取 dispatch 函数 | `const dispatch = useDispatch()` |
| `dispatch` | 发送 action | `dispatch(addToCart({ product, quantity: 1 }))` |
| `createSlice` | 创建 slice | `createSlice({ name, initialState, reducers })` |
| `configureStore` | 配置 store | `configureStore({ reducer: { cart: cartReducer } })` |

---

## 🎯 下一步学习

1. **Redux Thunk** - 处理异步操作（API 调用）
2. **Redux Persist** - 更高级的持久化方案
3. **Reselect** - 创建记忆化的 selectors
4. **RTK Query** - Redux Toolkit 的数据获取工具
5. **TypeScript** - 为 Redux 添加类型安全

---

## 💡 最佳实践

1. ✅ 使用 Redux Toolkit，不要使用传统 Redux
2. ✅ 将 selectors 定义在 slice 文件中
3. ✅ 使用 TypeScript 获得更好的类型安全
4. ✅ 保持 reducers 纯净（无副作用）
5. ✅ 使用 Redux DevTools 调试
6. ✅ 合理拆分 slices（按功能模块）
7. ✅ 使用 Immer 简化不可变更新

---

希望这份指南能帮助你理解 Redux 的工作原理！🎉
