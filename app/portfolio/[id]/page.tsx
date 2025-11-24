import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PortfolioDetailClient from './PortfolioDetailClient';

export default async function PortfolioDetailPage({ params }: { params: { id: string } }) {
  let portfolio = null;
  let error = null;

  try {
  const supabase = await createClient();
    const { data, error: fetchError } = await supabase
    .from('portfolio')
    .select('*')
    .eq('id', params.id)
    .single();
    
    portfolio = data;
    error = fetchError;
  } catch (err: any) {
    console.error('Failed to fetch portfolio:', err);
    error = err;
  }

  if (error || !portfolio) {
    notFound();
  }

  return <PortfolioDetailClient portfolio={portfolio} />;
}
