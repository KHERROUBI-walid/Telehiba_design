import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Bell,
  Home,
  List,
  Plus,
  MessageCircle,
  User,
  MapPin,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm bg-gradient-to-r from-app-purple to-app-sky">
        <h1 className="text-xl font-bold text-white">TeleHiba</h1>
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-white" />
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      {/* Search Bar and Location */}
      <div className="p-4 space-y-3 bg-white">
        {/* Location - visible on small screens below search */}
        <div className="flex md:hidden justify-center">
          <div className="bg-app-dark-blue text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            New York, USA
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Location - visible on larger screens */}
          <div className="hidden md:flex bg-app-dark-blue text-white px-4 py-2 rounded-full text-sm items-center gap-2">
            <MapPin className="w-4 h-4" />
            New York, USA
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-50 rounded-full px-4 py-3 shadow-lg">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search Doctor"
                className="flex-1 outline-none text-xs placeholder-gray-400 bg-transparent"
                style={{ fontSize: "9px" }}
              />
              <Filter className="w-5 h-5 text-gray-400 ml-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="mx-4 mb-6 bg-gradient-to-r from-app-purple to-app-pink rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold mb-2">
          Choisi ton vendeur, tes produits
        </h2>
        <p className="text-sm opacity-90">
          Envoi la commande et attends la notif
        </p>
      </div>

      {/* Category Buttons */}
      <div className="px-4 mb-6 bg-white">
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-gradient-to-br from-app-purple to-app-pink rounded-2xl p-4 text-white flex flex-col items-center justify-center aspect-square">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
              🥬
            </div>
            <span className="text-sm font-medium">Vegetables</span>
          </button>

          <button className="bg-gradient-to-br from-app-sky to-app-purple rounded-2xl p-4 text-white flex flex-col items-center justify-center aspect-square">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
              🍎
            </div>
            <span className="text-sm font-medium">Fruits</span>
          </button>

          <button className="bg-gradient-to-br from-app-pink to-app-sky rounded-2xl p-4 text-white flex flex-col items-center justify-center aspect-square">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
              👕
            </div>
            <span className="text-sm font-medium">Clothes</span>
          </button>
        </div>
      </div>

      {/* Vendor Section */}
      <div className="px-4 pb-24 bg-white">
        <h3 className="text-gray-800 font-semibold mb-4">Vendors</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/vendor-products?vendor=Dr. Sarah Johnson&city=New York, USA"
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="w-full h-24 bg-gradient-to-br from-app-purple to-app-sky rounded-xl mb-3"></div>
            <h4 className="font-medium text-gray-800">Dr. Sarah Johnson</h4>
            <p className="text-sm text-gray-500">New York, USA</p>
          </Link>

          <Link
            to="/vendor-products?vendor=Dr. Michael Chen&city=Brooklyn, NY"
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="w-full h-24 bg-gradient-to-br from-app-pink to-app-purple rounded-xl mb-3"></div>
            <h4 className="font-medium text-gray-800">Dr. Michael Chen</h4>
            <p className="text-sm text-gray-500">Brooklyn, NY</p>
          </Link>

          <Link
            to="/vendor-products?vendor=Dr. Emma Wilson&city=Manhattan, NY"
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="w-full h-24 bg-gradient-to-br from-app-sky to-app-pink rounded-xl mb-3"></div>
            <h4 className="font-medium text-gray-800">Dr. Emma Wilson</h4>
            <p className="text-sm text-gray-500">Manhattan, NY</p>
          </Link>

          <Link
            to="/vendor-products?vendor=Dr. James Rodriguez&city=Queens, NY"
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="w-full h-24 bg-gradient-to-br from-app-purple to-app-sky rounded-xl mb-3"></div>
            <h4 className="font-medium text-gray-800">Dr. James Rodriguez</h4>
            <p className="text-sm text-gray-500">Queens, NY</p>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex items-center justify-around py-3">
          <button className="flex flex-col items-center gap-1 px-4">
            <Home className="w-6 h-6 text-app-purple" />
            <span className="text-xs text-app-purple font-medium">Home</span>
          </button>

          <Link to="/orders" className="flex flex-col items-center gap-1 px-4">
            <List className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Orders</span>
          </Link>

          <button className="bg-app-yellow w-12 h-12 rounded-full flex items-center justify-center -mt-2 shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </button>

          <Link to="/chat" className="flex flex-col items-center gap-1 px-4">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Chat</span>
          </Link>

          <Link to="/profile" className="flex flex-col items-center gap-1 px-4">
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
