'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function EditNoticePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotice = async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        setError('공지사항을 불러오는데 실패했습니다.');
        return;
      }

      if (data) {
        setTitle(data.title || '');
        setContent(data.content || '');
        setImageUrl(data.image_url || '');
        setFileUrl(data.file_url || '');
        setFileName(data.file_name || '');
      }
    };

    if (params.id) {
      fetchNotice();
    }
  }, [params.id, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setFileName(file.name);
    }
  };

  const getImagePreview = (): string | null => {
    if (file && file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return imageUrl || null;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `notices/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-files')
        .upload(filePath, file);

      if (uploadError) {
        // 버킷이 없는 경우 더 명확한 에러 메시지 제공
        if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
          throw new Error(
            'Storage 버킷이 생성되지 않았습니다. Supabase 대시보드에서 Storage 버킷을 생성해주세요.\n\n' +
            '방법:\n' +
            '1. Supabase 대시보드 → Storage 메뉴\n' +
            '2. "New bucket" 클릭\n' +
            '3. 이름: portfolio-files, Public bucket 체크\n' +
            '4. 또는 SQL Editor에서 supabase-storage-setup.sql 실행\n\n' +
            '자세한 내용은 STORAGE_SETUP.md 파일을 참고하세요.'
          );
        }
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('portfolio-files')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      console.error('File upload error:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUploading(false);

    try {
      let uploadedFileUrl: string | null = fileUrl || null;

      // 새 파일이 선택되었으면 업로드
      if (file) {
        setUploading(true);
        const uploadedUrl = await uploadFile(file);
        if (!uploadedUrl) {
          throw new Error('파일 업로드에 실패했습니다.');
        }
        uploadedFileUrl = uploadedUrl;
        setUploading(false);
      }

      const { error } = await supabase
        .from('notices')
        .update({
          title,
          content,
          image_url: imageUrl || null,
          file_url: uploadedFileUrl,
          file_name: file ? fileName : (fileName || null),
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (error) throw error;

      router.push('/admin/notices');
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.');
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">공지사항 수정</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
            />
            <p className="mt-1 text-xs text-gray-500">이미지 URL을 입력하거나 아래에서 파일을 업로드하세요</p>
            
            {getImagePreview() && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">이미지 미리보기</p>
                <img
                  src={getImagePreview()!}
                  alt="미리보기"
                  className="w-full h-auto max-h-96 object-contain border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notice-file-upload-edit" className="block text-sm font-medium text-gray-700 mb-2">
              파일 첨부
            </label>
            <div className="space-y-2">
              <input
                id="notice-file-upload-edit"
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                accept="image/*,.pdf,.doc,.docx,.zip"
                aria-label="파일 첨부"
              />
              {file && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}
              {fileUrl && !file && (
                <div className="p-2 bg-blue-50 rounded">
                  <p className="text-sm text-blue-700">현재 파일: {fileName || '파일'}</p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    파일 보기
                  </a>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              이미지, PDF, 문서 파일을 업로드할 수 있습니다 (최대 10MB)
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {uploading ? '파일 업로드 중...' : loading ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

