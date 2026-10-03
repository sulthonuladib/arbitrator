const SideBarItem = ({ title, path }: { title: string; path: string }) => {
  return (
    <li>
      <a
        hx-target="#main-content"
        hx-get={path}
        hx-swap="innerHTML"
        hx-trigger="click"
        hx-push-url="true"
        hx-indicator=".progress"
        safe
      >
        {title}
      </a>
    </li>
  );
};

/**
 * The main navigation rail. The drawer wrapper lives in `BaseLayout`.
 */
export const Sidebar = () => {
  return (
    <nav
      aria-label="Main"
      class="flex min-h-full w-64 flex-col bg-base-300 p-4"
    >
      <a
        href="/"
        class="mb-4 flex items-center gap-3 rounded-box px-2 py-2 text-lg font-semibold"
      >
        <img
          class="mask mask-squircle size-10"
          src="/public/favicon.ico"
          alt=""
        />
        arbitmage
      </a>
      <ul class="menu gap-1 p-0">
        <SideBarItem title="Dashboard" path="dashboard" />
        <SideBarItem title="Signal" path="signal" />
        <SideBarItem title="Signal Settings" path="signal-settings" />
        <SideBarItem title="Exchange Management" path="markets" />
        <SideBarItem title="Cryptocurrency Management" path="coins" />
        <SideBarItem title="Chain Management" path="chain" />
        <SideBarItem title="Assignment" path="assignment" />
      </ul>
    </nav>
  );
};
