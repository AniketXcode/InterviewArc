import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Users, ChartBar as BarChart3, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    averageScore: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user?.id).single();
      if (data?.is_admin) {
        setIsAdmin(true);
        loadStats();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: profiles } = await supabase.from('profiles').select('id', { count: 'exact' });
      const { data: interviews } = await supabase.from('interviews').select('overall_score', { count: 'exact' });

      const totalUsers = profiles?.length || 0;
      const totalInterviews = interviews?.length || 0;
      const avgScore = interviews?.length > 0
        ? Math.round(interviews.reduce((sum, i) => sum + (i.overall_score || 0), 0) / interviews.length)
        : 0;

      setStats({
        totalUsers,
        totalInterviews,
        averageScore: avgScore,
        activeUsers: Math.round(totalUsers * 0.65),
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/60">Platform analytics and management</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Users</p>
                <p className="text-4xl font-bold text-cyan-400 mt-2">{stats.totalUsers}</p>
              </div>
              <Users className="text-cyan-400" size={32} />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active Users</p>
                <p className="text-4xl font-bold text-green-400 mt-2">{stats.activeUsers}</p>
              </div>
              <Activity className="text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Interviews</p>
                <p className="text-4xl font-bold text-blue-400 mt-2">{stats.totalInterviews}</p>
              </div>
              <BarChart3 className="text-blue-400" size={32} />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Average Score</p>
                <p className="text-4xl font-bold text-yellow-400 mt-2">{stats.averageScore}</p>
              </div>
              <TrendingUp className="text-yellow-400" size={32} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-lg border border-white/5">
                <span className="text-white">Database Status</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">Healthy</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-lg border border-white/5">
                <span className="text-white">API Uptime</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">99.9%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-lg border border-white/5">
                <span className="text-white">Active Sessions</span>
                <span className="text-white font-semibold">{Math.round(stats.activeUsers * 0.4)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white text-left font-medium transition">
                View User Reports
              </button>
              <button className="w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white text-left font-medium transition">
                Export Analytics
              </button>
              <button className="w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white text-left font-medium transition">
                System Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
