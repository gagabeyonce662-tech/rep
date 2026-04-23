import type {ElementType, ReactNode} from 'react';
import {PageContainer} from '~/components/Layout/PageContainer';

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  narrow?: boolean;
};

export function PageSection({
  children,
  className = '',
  as = 'section',
  narrow = false,
}: PageSectionProps) {
  return (
    <PageContainer as={as} narrow={narrow} className={className}>
      {children}
    </PageContainer>
  );
}
