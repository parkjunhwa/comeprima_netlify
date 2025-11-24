'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DeleteNoticePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotice = async () => {
      const { data } = await supabase
        .from('notices')
        .select('title')
        .eq('id', params.id)
        .single();

      if (data) {
        setTitle(data.title);
      }
    };

    if (params.id) {
      fetchNotice();
    }
  }, [params.id, supabase]);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setError('');
    setLoading(true);

    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', params.id);

      if (error) throw error;

      router.push('/admin/notices');
    } catch (err: any) {
      setError(err.message || '삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">공지사항 삭제</h1>

        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <p className="text-gray-700 mb-6">
            다음 공지사항을 삭제하시겠습니까?
          </p>
          <p className="text-lg font-semibold text-gray-900 mb-8">{title}</p>

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? '삭제 중...' : '삭제'}
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

