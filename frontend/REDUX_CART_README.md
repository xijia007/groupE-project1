# Redux 购物车实现说明

## 📦 已安装的依赖

```bash
npm install @reduxjs/toolkit react-redux
```

## 🏗️ Redux 架构

### 文件结构

```
src/
├── store/
│   ├── store.js          # Redux store 配置
│   └── cartSlice.js      # 购物车 slice (state + actions + reducers)
├── components/
│   ├── Header/
│   │   └── index.jsx     # 使用 useSelector 读取购物车数量
│   └── Products/
│       └── ProductItem.jsx  # 使用 useDispatch 和 useSelector
├── pages/
│   ├── Cart.jsx          # 使用 useDispatch 和 useSelector
│   └── ProductDetail.jsx # 使用 useDispatch 和 useSelector
└── main.jsx              # Redux Provider 包裹应用
```

## 🔑 核心概念

### 1. **Store** (`store/store.js`)
- 使用 `configureStore` 创建 Redux store
- 集中管理应用的所有状态
- 可以轻松添加更多的 reducers

### 2. **Slice** (`store/cartSlice.js`)
- 使用 `createSlice` 创建购物车 slice
- 包含：
  - **State**: 购物车商品列表
  - **Reducers**: 修改 state 的纯函数
  - **Actions**: 自动生成的 action creators
  - **Selectors**: 从 state 中提取数据的函数

### 3. **Actions**
```javascript
// 添加商品到购物车
dispatch(addToCart({ product, quantity: 1 }))

// 更新商品数量
dispatch(updateQuantity({ productId, quantity: 5 }))

// 移除商品
dispatch(removeFromCart(productId))

// 清空购物车
dispatch(clearCart())
```

### 4. **Selectors**
```javascript
// 获取所有购物车商品
const cartItems = useSelector(selectCartItems)

// 获取购物车商品总数量
const totalItems = useSelector(selectCartTotalItems)

// 获取购物车总价
const totalPrice = useSelector(selectCartTotalPrice)

// 获取特定商品的数量
const quantity = useSelector(selectItemQuantity(productId))
```

## 🎯 Redux vs Context API

### Redux 的优势：

1. **更好的性能优化**
   - 使用 `useSelector` 可以精确订阅需要的数据
   - 只有相关数据变化时才会重新渲染
   - Context API 会导致所有消费者重新渲染

2. **强大的开发工具**
   - Redux DevTools 可以查看所有 action 和 state 变化
   - 时间旅行调试（回退到之前的状态）
   - Action 历史记录

3. **更好的可测试性**
   - Reducers 是纯函数，易于测试
   - Actions 可以单独测试
   - 不需要 mock Context

4. **中间件支持**
   - 可以添加 logger、thunk、saga 等中间件
   - 处理异步操作更方便
   - 可以添加自定义中间件

5. **更好的代码组织**
   - 清晰的文件结构
   - 关注点分离
   - 易于扩展

### Context API 的优势：

1. **更简单**
   - 不需要额外的依赖
   - 学习曲线较低
   - 适合小型应用

2. **更少的样板代码**
   - 不需要配置 store
   - 不需要定义 actions 和 reducers

## 🚀 使用示例

### 在组件中使用 Redux

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartTotalItems } from '../store/cartSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const totalItems = useSelector(selectCartTotalItems);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div>
      <p>Cart has {totalItems} items</p>
      <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
    </div>
  );
}
```

## 🔍 Redux DevTools

安装 Redux DevTools 浏览器扩展后，你可以：

1. 查看所有 dispatched actions
2. 查看每个 action 前后的 state
3. 时间旅行调试
4. 导出/导入 state
5. 跳过或重放 actions

## 📊 数据流

```
用户操作 → dispatch(action) → reducer 更新 state → 
组件通过 selector 获取新 state → 组件重新渲染
```

## 💾 持久化

购物车数据会自动保存到 localStorage：
- 每次 state 更新时保存
- 页面刷新时从 localStorage 加载
- 在 `cartSlice.js` 中实现

## 🎨 最佳实践

1. **使用 Selectors**
   - 将数据提取逻辑封装在 selectors 中
   - 便于复用和测试

2. **保持 Reducers 纯净**
   - 不要在 reducer 中调用 API
   - 不要修改原始 state（Redux Toolkit 使用 Immer 处理）

3. **合理组织 Slices**
   - 每个功能模块一个 slice
   - 保持 slice 的职责单一

4. **使用 TypeScript**（可选）
   - 为 state、actions 添加类型
   - 更好的类型安全和自动补全

## 🔄 迁移说明

从 Context API 迁移到 Redux：

1. ✅ 安装依赖
2. ✅ 创建 slice 和 store
3. ✅ 替换 Provider
4. ✅ 更新所有组件使用 Redux hooks
5. ✅ 删除旧的 CartContext（可选）

所有功能保持不变，只是状态管理方式改变了！
