import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ArticlesProvider } from "@/contexts/ArticlesContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FloatingWidgets } from "@/components/FloatingWidgets";

// Import Halaman Utama
import Index from "./pages/Index.tsx";
import Article from "./pages/Article.tsx";
import Category from "./pages/Category.tsx";
import Media from "./pages/Media.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminSignup from "./pages/AdminSignup.tsx";

import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import NewsForm from "./pages/admin/NewsForm.tsx";
import Profile from "./pages/admin/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";

// --- IMPORT HALAMAN INFORMASI ---
import { TentangKami } from "./pages/TentangKami";
import { Redaksi } from "./pages/Redaksi";
import Kontak from "./pages/Kontak";

// --- PERBAIKAN: IMPORT HALAMAN KADER & STRUKTURAL ---
import { StructuralPage } from "./pages/StructuralPage"; // Halaman Publik
import { CadreManager } from "./pages/admin/CadreManager"; // Halaman Admin
import { EventManager } from "./pages/admin/EventManager"; // <-- TAMBAHAN: Halaman Admin Banner & Countdown

// --- TAMBAHAN: IMPORT HALAMAN RATING PELAYANAN & NEWSLETTER ---
import { RatingPelayanan } from "./pages/RatingPelayanan"; // <-- Halaman Publik Rating
import { RatingManager } from "./pages/admin/RatingManager"; // <-- Halaman Admin Rating

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ArticlesProvider>
            <Routes>
              {/* Rute Publik */}
              <Route path="/" element={<Index />} />
              <Route path="/berita/:slug" element={<Article />} />
              <Route path="/kategori/:slug" element={<Category />} />
              <Route path="/media" element={<Media />} />
              
              {/* Rute Halaman Informasi */}
              <Route path="/tentang-kami" element={<TentangKami />} />
              <Route path="/redaksi" element={<Redaksi />} />
              <Route path="/kontak" element={<Kontak />} />

              {/* PERBAIKAN: RUTE STRUKTURAL PUBLIK */}
              <Route path="/struktural" element={<StructuralPage />} />

              {/* TAMBAHAN: RUTE RATING PELAYANAN PUBLIK */}
              <Route path="/rating" element={<RatingPelayanan />} />

              {/* Rute Admin & Auth */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* RUTE ADMIN PROTECTED (KHUSUS REDAKSI/ADMIN) */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/profile"
                element={<ProtectedRoute><Profile /></ProtectedRoute>}
              />
              
              {/* PERBAIKAN: RUTE MANAJEMEN KADER ADMIN */}
              <Route
                path="/admin/cadres"
                element={<ProtectedRoute><CadreManager /></ProtectedRoute>}
              />

              {/* TAMBAHAN: RUTE MANAJEMEN EVENT BESAR & COUNTDOWN */}
              <Route
                path="/admin/events"
                element={<ProtectedRoute><EventManager /></ProtectedRoute>}
              />

              {/* TAMBAHAN: RUTE MANAJEMEN RATING & SUBSCRIPTION */}
              <Route
                path="/admin/ratings"
                element={<ProtectedRoute><RatingManager /></ProtectedRoute>}
              />

              <Route
                path="/admin/news/new"
                element={<ProtectedRoute><NewsForm /></ProtectedRoute>}
              />
              <Route
                path="/admin/news/:id/edit"
                element={<ProtectedRoute><NewsForm /></ProtectedRoute>}
              />
              
              {/* Catch-all Route untuk 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <FloatingWidgets />
          </ArticlesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
