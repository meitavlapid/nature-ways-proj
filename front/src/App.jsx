import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import Footer from "../components/Footer";
import Contact from "../pages/Contact";
import Admin from "../pages/Admin";
import Login from "../components/Login";
import AdminProducts from "../pages/AdminProducts";
import AddProduct from "../components/AddProduct";
import AdminVideos from "../components/AdminVideos";
import ProductPage from "../components/ProductPage";
import ProductListByCategory from "../components/ProductListByCategory";
import CustomDevelopment from "../pages/CustomDevelopment";
import EditProduct from "../components/EditProduct";
import ScrollToTopButton from "../components/ScrollToTopButton";
import About from "../pages/About";
import ArticlePage from "../pages/ArticlePage";
import UploadArticle from "../pages/UploadArticle";
import ArticleList from "../pages/ArticleList";
import EditArticle from "../pages/EditArticle";
import AdminUsers from "../pages/AdminUsers";
import RegisterForm from "../components/RegisterForm";
import ResetPassword from "../components/ResetPassword";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/videos" element={<AdminVideos />} />
        <Route path="/admin/add" element={<AddProduct />} />
        <Route path="/customdevelopment" element={<CustomDevelopment />} />
        <Route path="/:category" element={<ProductListByCategory />} />
        <Route path="/:category/:id" element={<ProductPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/addarticles" element={<UploadArticle />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/articles/edit/:id" element={<EditArticle />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/edit/:id" element={<EditProduct />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <ScrollToTopButton />

      <Footer />
    </>
  );
}

export default App;
