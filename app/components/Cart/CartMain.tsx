import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Layout/Aside';
import {CartLineItem, type CartLine} from '~/components/Cart/CartLineItem';
import {CartSummary} from './CartSummary';
import {Button} from '~/components/ui/Button';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const children = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(children)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className="flex flex-col h-full font-assistant"
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      <CartEmpty hidden={linesCount} layout={layout} />
      {linesCount && (
        <div className="flex-1 flex flex-col pt-4">
          <p id="cart-lines" className="sr-only">
            Line items
          </p>
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-black/10">
            <ul aria-labelledby="cart-lines" className="divide-y divide-brand-black/5">
              {(cart?.lines?.nodes ?? []).map((line) => {
                if ('parentRelationship' in line && line.parentRelationship?.parent) {
                  return null;
                }
                return (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    layout={layout}
                    childrenMap={childrenMap}
                    className="py-6 first:pt-0"
                  />
                );
              })}
            </ul>
          </div>
          {cartHasItems && <CartSummary cart={cart} layout={layout} />}
        </div>
      )}
    </section>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <div className="w-16 h-16 mb-6 opacity-20">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      </div>
      <h3 className="font-anton text-2xl uppercase tracking-tighter mb-4">Your bag is empty</h3>
      <p className="font-assistant text-brand-black/60 mb-8 max-w-[250px] text-sm">
        Looks like you haven&rsquo;t added anything yet. Let&rsquo;s get you started!
      </p>
      <Button 
        to="/collections/all-products" 
        onClick={close} 
        variant="primary"
        className="w-full"
      >
        Shop Latest Drop
      </Button>
    </div>
  );
}
