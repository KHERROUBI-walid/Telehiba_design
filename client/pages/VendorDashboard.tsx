import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Star, Eye, EyeOff, Package, Tag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "../components/BottomNavigation";

interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  unit: string;
  rating: number;
  sales: number;
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for vendor's products
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Tomates Bio",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=300&h=300&fit=crop&crop=center",
      category: "L��gumes",
      description: "Tomates biologiques fraîches, cultivées localement",
      inStock: true,
      unit: "kg",
      rating: 4.8,
      sales: 45
    },
    {
      id: 2,
      name: "Pommes Golden",
      price: 3.50,
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center",
      category: "Fruits",
      description: "Pommes Golden délicieuses et croquantes",
      inStock: true,
      unit: "kg",
      rating: 4.6,
      sales: 32
    },
    {
      id: 3,
      name: "Pain de Campagne",
      price: 2.80,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&crop=center",
      category: "Boulangerie",
      description: "Pain artisanal cuit au feu de bois",
      inStock: false,
      unit: "unité",
      rating: 4.9,
      sales: 28
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Légumes", description: "Légumes frais et biologiques", isActive: true },
    { id: 2, name: "Fruits", description: "Fruits de saison", isActive: true },
    { id: 3, name: "Boulangerie", description: "Pain et viennoiseries", isActive: true },
    { id: 4, name: "Épicerie", description: "Produits d'épicerie fine", isActive: false }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    unit: "kg",
    image: ""
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: ""
  });

  const [editProductForm, setEditProductForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    unit: "kg",
    image: ""
  });

  const [editCategoryForm, setEditCategoryForm] = useState({
    name: "",
    description: ""
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        description: newProduct.description,
        unit: newProduct.unit,
        image: newProduct.image || "https://images.unsplash.com/photo-1546547615-6d2b3c5f8a74?w=300&h=300&fit=crop&crop=center",
      };

      const createdProduct = await apiService.createProduct(productData);
      setProducts([...products, createdProduct]);
      setNewProduct({ name: "", price: "", category: "", description: "", unit: "kg", image: "" });
      setShowAddProductModal(false);

      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès"
      });
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit"
      });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la catégorie est obligatoire"
      });
      return;
    }

    const category: Category = {
      id: Date.now(),
      name: newCategory.name,
      description: newCategory.description,
      isActive: true
    };

    setCategories([...categories, category]);
    setNewCategory({ name: "", description: "" });
    setShowAddCategoryModal(false);
    
    toast({
      title: "Catégorie ajoutée",
      description: "La catégorie a été ajoutée avec succès"
    });
  };

  const handleEditProduct = async () => {
    if (!editingProduct || !editProductForm.name || !editProductForm.price || !editProductForm.category) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis"
      });
      return;
    }

    try {
      const updatedProduct = {
        ...editingProduct,
        name: editProductForm.name,
        price: parseFloat(editProductForm.price),
        category: editProductForm.category,
        description: editProductForm.description,
        unit: editProductForm.unit,
        image: editProductForm.image
      };

      // Update in state
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));

      setEditingProduct(null);
      setEditProductForm({ name: "", price: "", category: "", description: "", unit: "kg", image: "" });

      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès"
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la modification du produit"
      });
    }
  };

  const handleEditCategory = () => {
    if (!editingCategory || !editCategoryForm.name) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la catégorie est obligatoire"
      });
      return;
    }

    const updatedCategory = {
      ...editingCategory,
      name: editCategoryForm.name,
      description: editCategoryForm.description
    };

    setCategories(categories.map(c => c.id === editingCategory.id ? updatedCategory : c));
    setEditingCategory(null);
    setEditCategoryForm({ name: "", description: "" });

    toast({
      title: "Catégorie modifiée",
      description: "La catégorie a été modifiée avec succès"
    });
  };

  // Effect to populate edit forms when editing product/category is set
  useEffect(() => {
    if (editingProduct) {
      setEditProductForm({
        name: editingProduct.name,
        price: editingProduct.price.toString(),
        category: editingProduct.category,
        description: editingProduct.description,
        unit: editingProduct.unit,
        image: editingProduct.image
      });
    }
  }, [editingProduct]);

  useEffect(() => {
    if (editingCategory) {
      setEditCategoryForm({
        name: editingCategory.name,
        description: editingCategory.description
      });
    }
  }, [editingCategory]);

  const toggleProductStock = (productId: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ));
  };

  const toggleCategoryStatus = (categoryId: number) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const deleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès"
    });
  };

  const deleteCategory = (categoryId: number) => {
    setCategories(categories.filter(c => c.id !== categoryId));
    toast({
      title: "Catégorie supprimée",
      description: "La catégorie a été supprimée avec succès"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-pink via-app-purple to-app-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-app-pink/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-app-blue/20 to-white/10 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="flex items-center justify-between px-6">
          <Link to="/" className="text-white hover:scale-110 transition-transform duration-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Ma Boutique</h1>
            <p className="text-white/80 text-sm mt-1">{user?.businessName || "Gestion des produits"}</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 px-6 mb-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-2 flex">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
              activeTab === "products"
                ? "bg-white text-app-purple shadow-lg"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Produits</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
              activeTab === "categories"
                ? "bg-white text-app-purple shadow-lg"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Tag className="w-5 h-5" />
            <span className="font-medium">Catégories</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-24">
        {activeTab === "products" ? (
          <div>
            {/* Add Product Button */}
            <div className="mb-6">
              <Button
                onClick={() => setShowAddProductModal(true)}
                className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 h-12"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un produit
              </Button>
            </div>

            {/* Products List */}
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-start gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                          <p className="text-xs text-gray-500">{product.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleProductStock(product.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.inStock
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                          >
                            {product.inStock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-app-purple">{product.price}€/{product.unit}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{product.sales} ventes</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.inStock 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {product.inStock ? "En stock" : "Rupture"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Add Category Button */}
            <div className="mb-6">
              <Button
                onClick={() => setShowAddCategoryModal(true)}
                className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 h-12"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter une catégorie
              </Button>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCategoryStatus(category.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.isActive 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ajouter un produit</h3>
            <div className="space-y-4">
              <Input
                placeholder="Nom du produit"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Input
                placeholder="Prix (€)"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.filter(c => c.isActive).map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <Input
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <select
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg"
              >
                <option value="kg">Kilogramme (kg)</option>
                <option value="g">Gramme (g)</option>
                <option value="L">Litre (L)</option>
                <option value="unité">Unité</option>
              </select>
              <Input
                placeholder="URL de l'image (optionnel)"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddProduct} className="flex-1">
                Ajouter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddProductModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ajouter une catégorie</h3>
            <div className="space-y-4">
              <Input
                placeholder="Nom de la catégorie"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddCategory} className="flex-1">
                Ajouter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddCategoryModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
