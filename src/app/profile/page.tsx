"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LuminaLogo } from "@/components/ui/LuminaLogo";
import { Sun, Moon, Monitor, ArrowLeft, LogOut, Globe, ExternalLink, Loader2, Calendar, Trash2, X, AlertTriangle, User, Shield, Bell, Settings, Save, Check, Camera, Link as LinkIcon, Edit3, BarChart3, Link2 } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    async function loadProfile() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setEmail(user.email || "");
      setFullName(user.user_metadata?.full_name || user.email?.split("@")[0] || "User");
      setUsername(user.user_metadata?.username || user.email?.split("@")[0] || "");
      setBio(user.user_metadata?.bio || "");
      setWebsite(user.user_metadata?.website || "");
      setProfileImage(user.user_metadata?.avatar_url || null);

      const { data: userProjects, error: dbError } = await supabase
        .from("projects")
        .select("name, slug, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!dbError && userProjects) {
        setProjects(userProjects);
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    let avatarUrl = profileImage;

    // If there's a new image file, upload it to Supabase Storage
    if (imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) {
          // If the 'avatars' bucket doesn't exist, we'll get an error.
          // In a real app, you'd ensure the bucket exists via the dashboard.
          console.error("Storage upload error:", uploadError);
          // Fallback: if upload fails, we'll just try to proceed without the new image
          // or alert the user.
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          avatarUrl = publicUrl;
        }
      } catch (err) {
        console.error("Unexpected upload error:", err);
      }
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        username: username,
        bio: bio,
        website: website,
        avatar_url: avatarUrl
      }
    });

    if (!error && data.user) {
      setUser(data.user);
      setImageFile(null); // Clear the file after successful upload
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } else {
      console.error("Error updating profile:", error);
    }

    setIsSaving(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDelete = async () => {
    if (!projectToDelete || confirmName !== projectToDelete.name) return;

    setDeleting(true);
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("slug", projectToDelete.slug);

    if (!error) {
      setProjects(projects.filter(p => p.slug !== projectToDelete.slug));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      setConfirmName("");
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--page-bg)]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center"
        >
          <div className="scale-150 mb-8 group">
            <div className="relative">
              <LuminaLogo />
              <motion.div
                className="absolute inset-0 bg-white/20 dark:bg-black/20 mix-blend-overlay rounded-full blur-sm"
                animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 text-sm font-medium text-black/60 dark:text-white/60">
              <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
              User Profile
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] bg-grid text-[var(--foreground)] selection:bg-accent-glow/30 pb-0 flex flex-col items-center">


      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/80 dark:border-white/[0.06] dark:bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 md:px-12 relative">

          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center rounded-lg border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10 p-0.5 shadow-inner">
                <LuminaLogo />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-px h-4 bg-black/10 dark:bg-white/10" />
                <span className="text-sm font-bold tracking-tight text-black dark:text-white">Profile</span>
              </div>
            </Link>
          </div>

          {/* Right: Theme + Sign Out */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            {mounted && (
              <div className="flex items-center gap-0.5 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.05] dark:bg-white/[0.02] p-0.5 shadow-inner">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${theme === "light"
                    ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                    : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                    }`}
                >
                  <Sun size={11} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${theme === "system"
                    ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                    : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                    }`}
                >
                  <Monitor size={11} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${theme === "dark"
                    ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                    : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                    }`}
                >
                  <Moon size={11} strokeWidth={2.5} />
                </button>
              </div>
            )}

            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-black dark:text-white/80 rounded-lg border border-transparent transition-all duration-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:border-black/10 dark:hover:border-white/12 hover:text-black dark:hover:text-white cursor-pointer disabled:opacity-50 flex items-center justify-center"
            >
              {loggingOut ? <Loader2 size={12} className="animate-spin mr-2" /> : null}
              SIGN OUT
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8 relative z-10 flex-1">

        {/* Banner Header */}
        <div className="relative w-full bg-white/50 dark:bg-[#0a0a0c] border border-black/10 dark:border-white/10 rounded-[32px] p-8 overflow-hidden shadow-lg backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/[0.01] dark:from-white/[0.02] to-transparent pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-3xl font-bold shadow-2xl overflow-hidden relative group cursor-pointer"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-center">
                    <Camera size={32} className="text-black/20 dark:text-white/20 group-hover:text-black/40 dark:group-hover:text-white/40 transition-colors" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-black dark:text-white mb-1">{fullName}</h1>
                <p className="text-black/40 dark:text-white/40 text-sm font-medium tracking-wide">@{username || "username"}</p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl ${saveSuccess
                ? "bg-emerald-500 text-white"
                : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95"
                } disabled:opacity-50`}
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : saveSuccess ? (
                <Check size={16} />
              ) : (
                <Save size={16} />
              )}
              {saveSuccess ? "Changes Saved" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 flex flex-col gap-1.5 p-2 bg-white/50 dark:bg-[#0a0a0c] border border-black/10 dark:border-white/10 rounded-[32px] backdrop-blur-xl shadow-lg">
            <TabButton
              active={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
              icon={<User size={18} />}
              label="Personal Info"
            />
            <TabButton
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
              icon={<Shield size={18} />}
              label="Security & Access"
            />
            <TabButton
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
              icon={<BarChart3 size={18} />}
              label="Analytics"
            />
            <TabButton
              active={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
              icon={<Settings size={18} />}
              label="Preferences"
            />
            <div className="h-px bg-black/5 dark:bg-white/5 mx-3 my-1" />
            <TabButton
              active={activeTab === "deployments"}
              onClick={() => setActiveTab("deployments")}
              icon={<Globe size={18} />}
              label="Deployments"
            />
            <TabButton
              active={activeTab === "domains"}
              onClick={() => setActiveTab("domains")}
              icon={<Link2 size={18} />}
              label="Domains"
            />
          </div>

          {/* Content Area - Card Style */}
          <div className="flex-1 w-full bg-white/50 dark:bg-[#0a0a0c] border border-black/10 dark:border-white/10 rounded-[32px] p-8 shadow-lg backdrop-blur-xl min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === "personal" && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl font-bold mb-1">Personal Information</h2>
                    <p className="text-black/40 dark:text-white/40 text-sm">Update your personal details and public profile.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20 group-focus-within:text-violet-500 transition-colors" size={18} />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                          placeholder="Juan dela Cruz"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Username</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20 group-focus-within:text-violet-500 transition-colors text-sm font-bold">@</div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Email Address</label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20 transition-colors" size={18} />
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full bg-black/[0.01] dark:bg-white/[0.01] border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm opacity-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Website</label>
                      <div className="relative group">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20 group-focus-within:text-violet-500 transition-colors" size={18} />
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Bio</label>
                    <div className="relative group">
                      <Edit3 className="absolute left-4 top-4 text-black/20 dark:text-white/20 group-focus-within:text-violet-500 transition-colors" size={18} />
                      <textarea
                        id="bio-textarea"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 pt-4 pb-12 text-sm outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                        placeholder="Write a short bio about yourself..."
                      />
                      <button
                        onClick={() => document.getElementById('bio-textarea')?.focus()}
                        className="absolute bottom-4 right-4 px-4 py-2 bg-black/20 dark:bg-white/[0.03] hover:bg-white/[0.06] rounded-xl text-[10px] font-bold text-violet-500 uppercase tracking-widest transition-all cursor-pointer border border-white/[0.02] shadow-xl backdrop-blur-md"
                      >
                        {bio ? "Edit Bio" : "Add Bio"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl font-bold mb-1">Authentication</h2>
                    <p className="text-black/40 dark:text-white/40 text-sm">Manage your passwords and two-factor authentication.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Password</p>
                          <p className="text-xs text-black/40 dark:text-white/40">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-black/[0.05] dark:bg-white/[0.05] hover:bg-black/10 dark:hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
                        Change
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Two-Factor Authentication</p>
                          <p className="text-xs text-black/40 dark:text-white/40">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-black/10 dark:bg-white/10 rounded-full relative cursor-pointer group">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-white/60 rounded-full transition-all group-hover:bg-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl font-bold mb-1">Appearance</h2>
                    <p className="text-black/40 dark:text-white/40 text-sm">Customize the look and feel of your dashboard.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${theme === "light" ? "border-violet-500 bg-violet-500/5 shadow-lg" : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                        }`}
                    >
                      <div className="w-full aspect-video rounded-lg bg-white border border-black/5 overflow-hidden p-2">
                        <div className="w-full h-1 bg-black/10 rounded-full mb-1" />
                        <div className="w-2/3 h-1 bg-black/5 rounded-full" />
                      </div>
                      <span className="text-xs font-bold">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${theme === "dark" ? "border-violet-500 bg-violet-500/5 shadow-lg" : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                        }`}
                    >
                      <div className="w-full aspect-video rounded-lg bg-[#0a0a0c] border border-white/5 overflow-hidden p-2">
                        <div className="w-full h-1 bg-white/10 rounded-full mb-1" />
                        <div className="w-2/3 h-1 bg-white/5 rounded-full" />
                      </div>
                      <span className="text-xs font-bold">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${theme === "system" ? "border-violet-500 bg-violet-500/5 shadow-lg" : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                        }`}
                    >
                      <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-white via-gray-400 to-[#0a0a0c] border border-black/5 overflow-hidden p-2" />
                      <span className="text-xs font-bold">System</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "deployments" && (
                <motion.div
                  key="deployments"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-1">Published Websites</h2>
                      <p className="text-black/40 dark:text-white/40 text-sm">Manage your live projects and domains.</p>
                    </div>
                    <span className="px-3 py-1 bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {projects.length} Sites
                    </span>
                  </div>

                  <div className="space-y-4">
                    {projects.length === 0 ? (
                      <div className="text-center py-12">
                        <Globe className="mx-auto text-black/20 dark:text-white/20 mb-3" size={48} strokeWidth={1} />
                        <p className="text-black/50 dark:text-white/50 font-medium text-sm">You haven't published any websites yet.</p>
                        <Link
                          href="/dashboard"
                          className="inline-block mt-4 px-6 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm font-semibold transition-all"
                        >
                          Launch Your First Site
                        </Link>
                      </div>
                    ) : (
                      projects.map((project) => (
                        <div
                          key={project.slug}
                          className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.01] hover:bg-black/[0.04] dark:hover:bg-white/[0.03] hover:border-black/20 dark:hover:border-white/20 transition-all gap-4 shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
                              <Globe size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-black/90 dark:text-white/90 text-base">{project.name}</h3>
                              <div className="flex items-center gap-3 mt-1 text-xs text-black/40 dark:text-white/40">
                                <span className="flex items-center gap-1.5"><Calendar size={13} /> {new Date(project.created_at).toLocaleDateString()}</span>
                                <div className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
                                <span className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase tracking-tighter">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Live
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`/v/${project.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-5 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/80 dark:text-white/80 border border-black/10 dark:border-white/10 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-sm"
                            >
                              View Live Site
                            </a>

                            <button
                              onClick={() => { setProjectToDelete(project); setDeleteModalOpen(true); }}
                              className="flex items-center justify-center w-11 h-11 bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-2xl transition-all border border-red-500/10 hover:border-red-500/20 active:scale-95"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl font-bold mb-1">Analytics</h2>
                    <p className="text-black/40 dark:text-white/40 text-sm">Track your site performance and visitor metrics across all deployments.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Total Views", value: "0", change: "+0%" },
                      { label: "Unique Visitors", value: "0", change: "+0%" },
                      { label: "Avg. Session", value: "0m 0s", change: "+0%" }
                    ].map((stat, i) => (
                      <div key={i} className="p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[24px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 mb-2">{stat.label}</p>
                        <div className="flex items-end gap-3">
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs font-bold text-emerald-500 mb-1">{stat.change}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-12 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mb-4">
                      <BarChart3 className="text-violet-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No data available yet</h3>
                    <p className="text-black/40 dark:text-white/40 text-sm max-w-xs">
                      Once your sites start receiving traffic, you'll see detailed performance metrics here.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "domains" && (
                <motion.div
                  key="domains"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-1">Custom Domains</h2>
                      <p className="text-black/40 dark:text-white/40 text-sm">Connect your own domains to your Lumina websites.</p>
                    </div>
                    <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:opacity-90 transition-all">
                      Add Domain
                    </button>
                  </div>

                  <div className="p-12 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mb-4">
                      <Link2 className="text-violet-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No domains connected</h3>
                    <p className="text-black/40 dark:text-white/40 text-sm max-w-xs">
                      Upgrade to a Pro plan to connect custom domains to your projects.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!deleting) setDeleteModalOpen(false); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <AlertTriangle className="text-red-500" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Delete Website</h2>
                </div>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleting}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-white/60 text-sm leading-relaxed mb-6">
                This action is permanent and cannot be undone. To confirm deletion of <span className="text-white font-bold">{projectToDelete?.name}</span>, please type the project name below.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Confirm Project Name</label>
                  <input
                    type="text"
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    placeholder={projectToDelete?.name}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/10 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    disabled={deleting}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting || confirmName !== projectToDelete?.name}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Delete Forever
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all duration-300 cursor-pointer ${active
        ? "bg-black/5 dark:bg-white/[0.03] text-black dark:text-white shadow-sm"
        : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
        }`}
    >
      <span className={`whitespace-nowrap ${active ? "text-violet-500" : ""}`}>{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
      {active && (
        <motion.div
          layoutId="activeTab"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
        />
      )}
    </button>
  );
}
