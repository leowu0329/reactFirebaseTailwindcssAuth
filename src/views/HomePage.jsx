// src/views/HomePage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '確定要登出嗎？',
      text: "登出後需重新登入",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-10 text-center text-white">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30">
            <span className="text-3xl font-bold">
              {(user?.user_metadata?.display_name || user?.email || '?')[0].toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            歡迎回來，{user?.user_metadata?.display_name || '使用者'}
          </h1>
          <p className="mt-2 text-blue-100">{user?.email}</p>
        </div>
        
        <div className="p-8 flex flex-col gap-4">
          <button onClick={() => navigate('/profile')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2">
            個人資料設定
          </button>
          <button onClick={handleLogout} className="w-full bg-linear-to-r from-gray-800 to-gray-900 hover:from-black hover:to-black text-white font-bold py-3 rounded-lg transition-all shadow-lg">
            登出系統
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
