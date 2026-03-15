import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Edit2, Check, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProfileCard from "@/components/shared/ProfileCard";
import { SUBJECTS } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone_number: "",
    gender: "",
    experience_status: "",
    years_of_experience: "",
  });

  const [enrolledCoursesData, setEnrolledCoursesData] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age ? String(user.age) : "",
        phone_number: user.phone_number || "",
        gender: user.gender || "",
        experience_status: user.experience_status || "",
        years_of_experience: user.years_of_experience ? String(user.years_of_experience) : "",
      });
    }
  }, [user]);

  // Fetch true enrolled courses
  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingCourses(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/subjects", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allSubjects = await res.json();
        
        const coursesWithProgress = [];
        for (const sub of allSubjects) {
          const pRes = await fetch(`http://localhost:3000/api/progress/subjects/${sub.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const progressList = await pRes.json();
          if (Array.isArray(progressList) && progressList.length > 0) {
            const mockSub = SUBJECTS.find(s => s.title === sub.title);
            if (mockSub) {
              coursesWithProgress.push({
                ...mockSub,
                progress: Math.round((progressList.length / mockSub.lessons) * 100)
              });
            }
          }
        }
        setEnrolledCoursesData(coursesWithProgress);
      } catch (e) {
        console.error("Failed to fetch courses", e);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchProgress();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("token");
    try {
      const payload = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age, 10) : null,
        phone_number: formData.phone_number,
        gender: formData.gender,
        experience_status: formData.experience_status,
        years_of_experience: formData.experience_status === "Experienced" && formData.years_of_experience 
          ? parseInt(formData.years_of_experience, 10) 
          : null,
      };

      const res = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        updateUser(payload);
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  const totalProgress = enrolledCoursesData.length
    ? Math.round(enrolledCoursesData.reduce((acc, s) => acc + s.progress, 0) / enrolledCoursesData.length)
    : 0;

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10 bg-card p-6 rounded-3xl shadow-sm border border-border/50"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary shrink-0 ring-1 ring-primary/20">
              {userInitials}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{user?.name || "User"}</h1>
              <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
              <div className="mt-2 text-xs font-medium px-2.5 py-1 bg-secondary text-muted-foreground inline-flex rounded-full">
                Student Member
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              isEditing ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Account Details</h2>
              <div className="bg-card rounded-3xl shadow-card p-6 border border-border/50">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={e => setFormData({ ...formData, age: e.target.value })}
                          className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                        <input
                          type="text"
                          value={formData.phone_number}
                          onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                          className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={e => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience Level</label>
                        <select
                          value={formData.experience_status}
                          onChange={e => setFormData({ ...formData, experience_status: e.target.value, years_of_experience: e.target.value === "Fresher" ? "" : formData.years_of_experience })}
                          className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="">Select Level</option>
                          <option value="Fresher">Fresher (Student/No XP)</option>
                          <option value="Experienced">Experienced Professional</option>
                        </select>
                      </div>
                      {formData.experience_status === "Experienced" && (
                        <div className="space-y-1.5 flex flex-col justify-end">
                           <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Years of Experience</label>
                           <input
                            type="number"
                            value={formData.years_of_experience}
                            onChange={e => setFormData({ ...formData, years_of_experience: e.target.value })}
                            className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : <><Check className="w-4 h-4" /> Save Changes</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Full Name</h4>
                      <p className="text-sm font-medium text-foreground">{user?.name || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email Address</h4>
                      <p className="text-sm font-medium text-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Phone Number</h4>
                      <p className="text-sm font-medium text-foreground">{user?.phone_number || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Age</h4>
                      <p className="text-sm font-medium text-foreground">{user?.age || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Gender</h4>
                      <p className="text-sm font-medium text-foreground">{user?.gender || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Experience Status</h4>
                      <p className="text-sm font-medium text-foreground">
                        {user?.experience_status || "Not set"} 
                        {user?.experience_status === "Experienced" && user?.years_of_experience ? ` (${user.years_of_experience} Years)` : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">My Learning Path</h2>
              {loadingCourses ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Loading enrolled courses...</div>
              ) : enrolledCoursesData.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCoursesData.map((subject) => (
                    <ProfileCard key={subject.id} subject={subject} />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-3xl shadow-card p-10 text-center border border-border/50">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">No active courses</h3>
                  <p className="text-sm text-muted-foreground">Start exploring the catalog and begin your journey.</p>
                </div>
              )}
            </section>

          </div>

          {/* Right Sidebar Area */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Focus Stats</h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-card rounded-3xl shadow-card p-6 border border-border/50 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{enrolledCoursesData.length}</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Enrolled Courses</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-card rounded-3xl shadow-card p-6 border border-border/50 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalProgress}%</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Avg. Progress</p>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;
