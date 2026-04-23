import type {ReactNode} from 'react';

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  withDivider?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className = '',
  titleClassName = '',
  withDivider = true,
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {eyebrow ? (
        <span className="italic text-sm md:text-base text-brand-muted">{eyebrow}</span>
      ) : null}
      <h1
        className={`text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.03em] leading-[0.95] text-brand-black ${titleClassName}`}
      >
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-[15px] md:text-base leading-[1.7] font-light text-brand-muted">
          {description}
        </p>
      ) : null}
      {withDivider ? <div className="h-px w-full bg-brand-line mt-1" /> : null}
    </div>
  );
}
