import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import City from "./pages/City";
import News from "./pages/News";
import SubCategory from "./pages/SubCategory";
import Category from "./pages/Category";
import PageManagement from "./pages/PageManagment";
import WriterManagement from "./pages/WriterManagment";
import ReportManagement from "./pages/Report";
import DashboardPage from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import AdminProtectedRoutes from "./Utils/AdminProtectedRoutes";
import WriterProtectedRoutes from "./Utils/WriterProtectedRoutes"; // << add this
import CreateNews from "./pages/CreateNews";
import EditNews from "./pages/EditNews";
import WriterDashboard from "./pages/Writer/WriterDashboard";
import WriterNews from "./pages/Writer/WriterNews";
import WriterCreateNews from "./pages/Writer/WriterCreateNews";
import WriterEditNews from "./pages/Writer/WriterEditNews";
import Profile from "./pages/Auth/Profile";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import Otp from "./pages/Auth/Otp";
import NewPassword from "./pages/Auth/NewPassword";
import HomeSettings from "./pages/HomeSettings";
import PinArticles from "./pages/PinArticles";
import TrendingArticles from "./pages/TrendingArticles";
import AdsComponent from "./pages/AdsComponent";
import TopPicks from "./pages/TopPicks";
import CategoryPageSettings from "./pages/CategoryPageSettings";
import CategoryMainSettings from "./pages/CategoryMainSettings";
import CategoryTrendingNews from "./pages/CategoryTrendingNews";
import CategoryAdsSettings from "./pages/CategoryAdsSettings";
import SubCategorySetting from "./pages/SubCategorySettings";
import SubCategoryMainSection from "./pages/SubCategoryMainSection";
import SubCategoryAdsSection from "./pages/SubCategoryAdsSection";
import AritclePageSetting from "./pages/AritclePageSetting";
import ArticleAds from "./pages/AritclePageSetting";
import VideoUploadDemo from "./pages/VideoUploadDemo";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-otp" element={<Otp />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Admin-only routes */}
        <Route path="/" element={<AdminProtectedRoutes Component={DashboardPage} />} />
        <Route path="/city" element={<AdminProtectedRoutes Component={City} />} />
        <Route path="/news" element={<AdminProtectedRoutes Component={News} />} />
        <Route path="/create-news" element={<AdminProtectedRoutes Component={CreateNews} />} />
        <Route path="/edit-news" element={<AdminProtectedRoutes Component={EditNews} />} />
        <Route path="/sub-category" element={<AdminProtectedRoutes Component={SubCategory} />} />
        <Route path="/category" element={<AdminProtectedRoutes Component={Category} />} />
        <Route path="/page" element={<AdminProtectedRoutes Component={PageManagement} />} />
        <Route path="/writer-management" element={<AdminProtectedRoutes Component={WriterManagement} />} />
        <Route path="/report" element={<AdminProtectedRoutes Component={ReportManagement} />} />
        <Route path="/profile" element={<AdminProtectedRoutes Component={Profile} />} />
        <Route path="/home-settings" element={<AdminProtectedRoutes Component={HomeSettings} />} />
        <Route path="/settings/pin-article" element={<AdminProtectedRoutes Component={PinArticles} />} />
        <Route path="/settings/trending" element={<AdminProtectedRoutes Component={TrendingArticles} />} />
        <Route path="/settings/ads" element={<AdminProtectedRoutes Component={AdsComponent} />} />
        <Route path="/settings/top-picks" element={<AdminProtectedRoutes Component={TopPicks} />} />
        <Route path="/category-page-settings" element={<AdminProtectedRoutes Component={CategoryPageSettings} />} />
        <Route path="/settings/category/main" element={<AdminProtectedRoutes Component={CategoryMainSettings} />} />
        <Route path="/settings/category/trending" element={<AdminProtectedRoutes Component={CategoryTrendingNews} />} />
        <Route path="/settings/category/ads" element={<AdminProtectedRoutes Component={CategoryAdsSettings} />} />
        <Route path="/settings/sub-category" element={<AdminProtectedRoutes Component={SubCategorySetting} />} />
        <Route path="/settings/subcategory/main" element={<AdminProtectedRoutes Component={SubCategoryMainSection} />} />
        <Route path="/settings/subcategory/ads" element={<AdminProtectedRoutes Component={SubCategoryAdsSection} />} />
        <Route path="/settings/article" element={<AdminProtectedRoutes Component={AritclePageSetting} />} />
        <Route path="/settings/article/ads" element={<AdminProtectedRoutes Component={ArticleAds} />} />
        <Route path="/video-upload" element={<AdminProtectedRoutes Component={VideoUploadDemo} />} />

        {/* Writer-only routes */}
        <Route path="/writer" element={<WriterProtectedRoutes Component={WriterDashboard} />} />
        <Route path="/writer-create-news" element={<WriterProtectedRoutes Component={WriterCreateNews} />} />
        <Route path="/writer-edit-news" element={<WriterProtectedRoutes Component={WriterEditNews} />} />
        <Route path="/writer-news" element={<WriterProtectedRoutes Component={WriterNews} />} />
        <Route path="/writer-profile" element={<WriterProtectedRoutes Component={Profile} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
