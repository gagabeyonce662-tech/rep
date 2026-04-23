import type {ReactNode, ElementType} from 'react';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  narrow?: boolean;
};

export function PageContainer({
  children,
  className = '',
  as: Tag = 'div',
  narrow = false,
}: PageContainerProps) {
  const maxWidthClass = narrow ? 'max-w-[1100px]' : 'max-w-[1400px]';

  return (
    <Tag className={`${maxWidthClass} mx-auto px-5 md:px-8 lg:px-10 ${className}`}>
      {children}
    </Tag>
  );
}
