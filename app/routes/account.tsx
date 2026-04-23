import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="account max-w-[1400px] mx-auto px-4 md:px-8 py-16 font-assistant">
      <h1 className="text-5xl md:text-7xl font-light tracking-[-0.02em] leading-[1.05] mb-10">{heading}</h1>
      <AccountMenu />
      <div className="mt-12">
        <Outlet context={{customer}} />
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <nav className="flex flex-wrap gap-4 border-b border-brand-black/10 pb-4" role="navigation">
      <AccountNavLink to="/account/orders">Orders</AccountNavLink>
      <AccountNavLink to="/account/profile">Profile</AccountNavLink>
      <AccountNavLink to="/account/addresses">Addresses</AccountNavLink>
      <Logout />
    </nav>
  );
}

function AccountNavLink({to, children}: {to: string, children: React.ReactNode}) {
  return (
    <NavLink 
      to={to} 
      className={({isActive}) => 
        `font-assistant font-bold uppercase tracking-[0.25em] text-xs px-4 py-2 border transition-colors duration-300 ${
          isActive 
            ? 'bg-brand-black text-white' 
            : 'bg-transparent text-brand-black/60 hover:text-brand-black'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <Button type="submit" variant="ghost" className="px-4 py-2">
        Sign out
      </Button>
    </Form>
  );
}
