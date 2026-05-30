import { useState } from 'react';
import { supabase } from '../supabase/config';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import InputPassword from '../components/InputPassword';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 使用 Supabase 註冊並夾帶 metadata (顯示名稱)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      await Swal.fire({
        title: '註冊成功！',
        text: '驗證信已寄出，請前往信箱確認後再重新登入。',
        icon: 'success',
        confirmButtonText: '前往登入'
      });

      navigate('/login');
    } catch (error) {
      let message = '註冊失敗，請稍後再試';
      if (error.code === 'auth/email-already-in-use') message = '此信箱已被註冊';
      if (error.code === 'auth/weak-password') message = '密碼強度不足（至少 6 位數）';
      
      Swal.fire('錯誤', message, 'error');
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">建立帳號</h2>
          <p className="mt-2 text-blue-100">加入我們，開啟您的旅程</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-4">
              {/* 使用者名稱 */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">使用者名稱</label>
                <input
                  type="text"
                  placeholder="您的暱稱"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-hidden"
                  onChange={e => setDisplayName(e.target.value)}
                />
              </div>

              {/* 電子郵件 */}
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

              {/* 密碼 */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">密碼</label>
                <InputPassword
                  placeholder="至少 6 位字元"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-98 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? '註冊中...' : '建立帳號'}
            </button>

            <div className="pt-4 text-center text-sm">
              <span className="text-gray-500">已經有帳號了？</span>{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:underline">立即登入</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;