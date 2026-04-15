import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/Cart/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {captureEvent} from '~/lib/posthog.client';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {Button} from '~/components/ui/Button';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  return (
    <div aria-labelledby={summaryId} className="flex flex-col gap-6 pt-6 border-t border-brand-black/10">
      <h4 id={summaryId} className="font-serif text-2xl font-light tracking-[-0.02em]">Totals</h4>
      
      <div className="flex justify-between items-baseline font-serif text-lg font-light">
        <span className="font-serif italic text-sm text-brand-muted">Subtotal</span>
        <span>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>

      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />
      
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
      />
      
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-4">
      <Button
        to={checkoutUrl}
        variant="primary"
        className="w-full py-4 text-lg"
        onClick={() => captureEvent('checkout_started', {checkout_url: checkoutUrl})}
      >
        Checkout &rarr;
      </Button>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label="Discounts" className="space-y-4">
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 && (
        <div className="space-y-2">
          <p id={discountsHeadingId} className="font-serif italic text-sm text-brand-muted">Applied Discounts</p>
          <UpdateDiscountForm>
            <div className="flex items-center justify-between p-3 bg-brand-gray/50 border border-brand-black/5">
              <code className="font-assistant font-bold text-sm">{codes?.join(', ')}</code>
              <button type="submit" className="font-serif italic text-xs text-brand-muted hover:text-brand-black border-b border-brand-line hover:border-brand-black pb-0.5">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      )}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="PROMO CODE"
            className="flex-1 bg-transparent border border-brand-black/10 px-4 py-2 font-assistant text-sm focus:border-brand-black outline-none transition-colors"
          />
          <Button type="submit" variant="secondary" className="px-6 py-2">
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher();

  return (
    <section aria-label="Gift cards" className="space-y-4">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div className="space-y-2">
          <p id={giftCardHeadingId} className="font-serif italic text-sm text-brand-muted">Applied Gift Cards</p>
          {giftCardCodes.map((giftCard) => (
            <div key={giftCard.id} className="flex justify-between items-center p-3 bg-brand-gray/50 border border-brand-black/5">
              <div className="flex gap-4 items-center">
                <code className="font-assistant font-bold text-sm">***{giftCard.lastCharacters}</code>
                <Money data={giftCard.amountUsed} className="text-sm opacity-60" />
              </div>
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
              >
                <button type="submit" className="font-serif italic text-xs text-brand-muted hover:text-brand-black border-b border-brand-line hover:border-brand-black pb-0.5">
                  Remove
                </button>
              </RemoveGiftCardForm>
            </div>
          ))}
        </div>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="flex gap-2">
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="GIFT CARD"
            className="flex-1 bg-transparent border border-brand-black/10 px-4 py-2 font-assistant text-sm focus:border-brand-black outline-none transition-colors"
            ref={giftCardCodeInput}
          />
          <Button
            type="submit"
            variant="secondary"
            className="px-6 py-2"
          >
            Apply
          </Button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
