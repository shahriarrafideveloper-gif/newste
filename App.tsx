
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Upcoming from './pages/Upcoming';
import ProductDetail from './pages/ProductDetail';
import OrderModal from './components/OrderModal';
import { ConfirmedOrder, Product } from './types';

export type ViewType = 'HOME' | 'ABOUT' | 'UPCOMING';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('HOME');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MEN' | 'WOMEN'>('ALL');
  const [confirmedOrders, setConfirmedOrders] = useState<ConfirmedOrder[]>([]);
  
  // States for detailed view and ordering
  const [detailedProduct, setDetailedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState<Product | null>(null);

  // Prune expired orders every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setConfirmedOrders(prev => prev.filter(order => order.expiryTime > now));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setDetailedProduct(null); // Close detail if navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: 'ALL' | 'MEN' | 'WOMEN') => {
    setActiveCategory(category);
    setActiveView('HOME');
    setDetailedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addConfirmedOrder = (order: Omit<ConfirmedOrder, 'id' | 'timestamp' | 'expiryTime'>) => {
    const now = Date.now();
    const newOrder: ConfirmedOrder = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: now,
      expiryTime: now + 5 * 60 * 1000, // 5 minutes from now
    };
    setConfirmedOrders(prev => [newOrder, ...prev]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'ABOUT':
        return <div className="animate-in fade-in duration-500"><About /></div>;
      case 'UPCOMING':
        return <div className="animate-in fade-in duration-500"><Upcoming /></div>;
      default:
        return (
          <div className="animate-in fade-in duration-500">
            <Home 
              activeCategory={activeCategory} 
              onProductClick={(product) => setDetailedProduct(product)}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-main-gradient selection:bg-sea-green selection:text-black overflow-x-hidden">
      <Navbar 
        activeView={activeView}
        onViewChange={handleViewChange}
        onCategorySelect={handleCategorySelect}
        confirmedOrders={confirmedOrders}
      />
      
      <main className="flex-grow pt-4">
        {renderView()}
      </main>
      
      <Footer />

      {/* Full-screen Product Detail View */}
      {detailedProduct && (
        <ProductDetail 
          product={detailedProduct}
          onClose={() => setDetailedProduct(null)}
          onBuyNow={() => {
            setIsOrdering(detailedProduct);
          }}
        />
      )}

      {/* Order Modal */}
      {isOrdering && (
        <OrderModal 
          product={isOrdering}
          onClose={() => setIsOrdering(null)}
          onConfirmSuccess={() => {
            addConfirmedOrder({
              productName: isOrdering.name,
              price: isOrdering.price
            });
            setIsOrdering(null);
            setDetailedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
