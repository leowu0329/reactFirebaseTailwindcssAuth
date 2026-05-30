import { useState } from 'react';
import { auth } from '../firebase/config';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import InputPassword from '../components/InputPassword';

const ProfilePage = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 功能點 11: 修改顯示名稱
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      Swal.fire('更新成功', '個人資料已更新', 'success');
    } catch (error) {
      Swal.fire('更新失敗', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 功能點 9: 更改密碼
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return Swal.fire('錯誤', '新密碼與確認密碼不符', 'error');

    setLoading(true);
    try {
      // Firebase 更改密碼前必須重新驗證身份
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      await Swal.fire('修改成功', '下次登入請使用新密碼', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Swal.fire('修改失敗', '請檢查目前密碼是否正確', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4 py-12">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">個人設定</h2>
          <Link to="/" className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">返回首頁</Link>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 基本資料區 - 包含不可修改的 Email */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">基本資料</h3>
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500">電子郵件 (不可修改)</label>
                <input
                  type="text"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-gray-400 cursor-not-allowed outline-hidden"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">顯示名稱</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-200 outline-hidden"
                />
              </div>
              <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                更新名稱
              </button>
            </form>
          </section>

          {/* 安全性區 - 更改密碼 */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">更改密碼</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <InputPassword
                placeholder="目前密碼"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <InputPassword
                placeholder="新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <InputPassword
                placeholder="確認新密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button disabled={loading} className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                儲存新密碼
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;