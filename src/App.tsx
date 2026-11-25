import React from 'react';
import { Layout } from './components/Layout';
import { CATEGORY_MAP } from './data/categories';
import { RouterProvider, useRouter } from './lib/router';
import { BlogArticlePage, BlogIndexPage } from './pages/BlogPages';
import { CalculatorPage } from './pages/CalculatorPage';
import { CategoryPage } from './pages/CategoryPage';
import { HomePage } from './pages/HomePage';
import { PartnersPage } from './pages/PartnersPage';
import { SeoLandingPageView } from './pages/SeoLandingPageView';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import type { CategorySlug } from './types/finance';

function PageView() {
  const { pathname } = useRouter();
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  if (clean === '/') {
    return <HomePage />;
  }

  const possibleCat = clean.slice(1) as CategorySlug;
  if (CATEGORY_MAP[possibleCat]) {
    return <CategoryPage slug={possibleCat} />;
  }

  if (clean.startsWith('/calculators/')) {
    const slug = clean.replace('/calculators/', '');
    return <CalculatorPage slug={slug} />;
  }

  if (clean === '/tools') {
    return <ToolsDirectoryPage />;
  }

  if (clean.startsWith('/tools/')) {
    const slug = clean.replace('/tools/', '');
    return <SeoLandingPageView slug={slug} />;
  }

  if (clean === '/blog') {
    return <BlogIndexPage />;
  }

  if (clean.startsWith('/blog/')) {
    const slug = clean.replace('/blog/', '');
    return <BlogArticlePage slug={slug} />;
  }

  if (clean === '/partners') {
    return <PartnersPage />;
  }

  return <HomePage />;
}

export default function App() {
  return (
    <RouterProvider>
      <Layout>
        <PageView />
      </Layout>
    </RouterProvider>
  );
}
