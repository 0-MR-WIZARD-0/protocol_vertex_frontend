import { MainLayout } from '../../widgets/layout/MainLayout';

export default function AppealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}