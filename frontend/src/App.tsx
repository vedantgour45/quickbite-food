import { Route, Routes } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { MenuPage } from '@/pages/MenuPage';
import { OrderTrackingPage } from '@/pages/OrderTrackingPage';

const App = () => (
  <div className="min-h-screen bg-[#FFF7F5]">
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderTrackingPage />} />
      </Routes>
    </main>
  </div>
);

export default App;
