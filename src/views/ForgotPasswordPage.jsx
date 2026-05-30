import { useState } from 'react';
import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 功能點 6: 發送 Reset Password 信箱驗證
      await sendPasswordResetEmail(auth, email);
      
      await Swal.fire({
        title: '重設郵件已寄出',
        text: '請前往您的信箱查看重設密碼連結',
        icon: 'success',
        confirmButtonText: '回到登入頁'
      });
      
      // 引導使用者回到登入頁面準備使用新密碼
      navigate('/login');
    } catch (error) {
      let message = '發生錯誤，請稍後再試';
      if (error.code === 'auth/user-not-found') {
        message = '找不到此電子郵件對應的使用者';
      } else if (error.code === 'auth/invalid-email') {
        message = '信箱格式不正確';
      }
      
      Swal.fire({
        title: '發送失敗',
        text: message,
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">重設密碼</h2>
          <p className="mt-2 text-blue-100">別擔心，我們會協助您找回</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">註冊電子郵件</label>
              <input
                type="email"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-hidden"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-98 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? '處理中...' : '發送重設郵件'}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                ← 返回登入頁面
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;