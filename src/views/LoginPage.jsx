import { useState } from 'react';
import { supabase } from '../supabase/config';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import InputPassword from '../components/InputPassword';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut();
        Swal.fire({
          title: '信箱未驗證',
          text: '請先至信箱完成驗證再進行登入',
          icon: 'warning',
          confirmButtonText: '確定'
        });
      } else {
        Swal.fire({
          title: '登入成功',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/');
      }
    } catch (error) {
      Swal.fire({
        title: '登入失敗',
        text: '帳號或密碼錯誤',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        {/* 頂部裝飾區 */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">歡迎回來</h2>
          <p className="mt-2 text-blue-100">請登入您的帳戶以繼續</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">電子郵件</label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-hidden"
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">密碼</label>
                <InputPassword
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative flex w-full justify-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-98 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                "立即登入"
              )}
            </button>

            <div className="flex flex-col space-y-4 pt-4 text-center">
              <div className="flex items-center justify-between text-sm">
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  註冊帳號
                </Link>
                <Link to="/forgot-password" className="font-semibold text-red-500 hover:text-red-700 transition-colors">
                  忘記密碼？
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
