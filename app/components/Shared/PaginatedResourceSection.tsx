import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  ariaLabel?: string;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        const linkClass =
          'inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-brand-black/80 hover:text-brand-black border-b border-brand-black/30 hover:border-brand-black pb-1 transition-colors';
        return (
          <div className="flex flex-col gap-12">
            <div className="flex justify-center">
              <PreviousLink className={linkClass}>
                {isLoading ? (
                  'Loading…'
                ) : (
                  <>
                    <span aria-hidden="true">↑</span>
                    <span>Load previous</span>
                  </>
                )}
              </PreviousLink>
            </div>
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}
            <div className="flex justify-center">
              <NextLink className={linkClass}>
                {isLoading ? (
                  'Loading…'
                ) : (
                  <>
                    <span>Load more</span>
                    <span aria-hidden="true">↓</span>
                  </>
                )}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
