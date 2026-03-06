import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { resumeParser } from '../../utils/resumeParser';
import { User, Lock, FileText, Bell, LogOut, Save, Loader } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, authService: authService2 } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [resumeData, setResumeData] = useState({
    resumeText: profile?.resume_text || '',
    skills: [],
    experience: [],
    education: [],
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    weeklyReport: true,
    interviewReminders: true,
  });

  useEffect(() => {
    if (profile?.resume_text) {
      const parsed = resumeParser.parseResume(profile.resume_text);
      if (parsed) {
        setResumeData(prev => ({
          ...prev,
          skills: parsed.skills,
          experience: parsed.experience,
          education: parsed.education,
        }));
      }
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await authService2.supabase.from('profiles').update({
        full_name: formData.fullName,
      }).eq('id', user.id);

      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await authService.updatePassword(passwordData.newPassword);
      setMessage('Password updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage('Failed to update password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await file.text();
      setResumeData(prev => ({ ...prev, resumeText: text }));

      const parsed = resumeParser.parseResume(text);
      if (parsed) {
        setResumeData(prev => ({
          ...prev,
          skills: parsed.skills,
          experience: parsed.experience,
          education: parsed.education,
        }));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService2.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your account and preferences</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
              activeTab === 'profile'
                ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
              activeTab === 'password'
                ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Lock size={18} />
            Password
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
              activeTab === 'resume'
                ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <FileText size={18} />
            Resume
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
              activeTab === 'notifications'
                ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Bell size={18} />
            Notifications
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('successfully')
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/60 cursor-not-allowed opacity-50"
                />
                <p className="text-white/60 text-xs mt-2">Email cannot be changed</p>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading || !passwordData.newPassword}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                Update Password
              </button>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Resume</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-4">Upload Resume</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center mb-6">
                  <label className="cursor-pointer">
                    <FileText className="mx-auto text-white/40 mb-4" size={32} />
                    <p className="text-white font-medium">Click to upload</p>
                    <p className="text-white/60 text-sm">PDF, DOC, or TXT</p>
                    <input
                      type="file"
                      onChange={handleResumeUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </div>
              </div>

              {resumeData.skills.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Extracted Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.education.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Education</h3>
                  <div className="space-y-2">
                    {resumeData.education.map((edu, idx) => (
                      <p key={idx} className="text-white/60 text-sm">{edu}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <label key={key} className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-lg border border-white/5 cursor-pointer hover:border-white/10">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-500"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {key === 'emailNotifications' && 'Email Notifications'}
                      {key === 'weeklyReport' && 'Weekly Progress Report'}
                      {key === 'interviewReminders' && 'Interview Reminders'}
                    </p>
                    <p className="text-white/60 text-sm">
                      {key === 'emailNotifications' && 'Receive updates about your progress'}
                      {key === 'weeklyReport' && 'Get weekly summaries of your performance'}
                      {key === 'interviewReminders' && 'Reminders to practice interviews'}
                    </p>
                  </div>
                </label>
              ))}

              <button
                onClick={() => setMessage('Notification settings saved!')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 mt-6"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/20 border border-red-500 text-red-400 py-3 rounded-lg font-medium hover:opacity-90 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
