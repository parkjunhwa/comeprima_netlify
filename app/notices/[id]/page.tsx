import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import NoticeDetailClient from './NoticeDetailClient';

export default async function NoticeDetailPage({ params }: { params: { id: string } }) {
  let notice = null;
  let error = null;

  try {
    const supabase = await createClient();
    const { data, error: fetchError } = await supabase
      .from('notices')
      .select('*')
      .eq('id', params.id)
      .single();
    
    notice = data;
    error = fetchError;
  } catch (err: any) {
    console.error('Failed to fetch notice:', err);
    error = err;
  }

  if (error || !notice) {
    notFound();
  }

  return <NoticeDetailClient notice={notice} />;
}

