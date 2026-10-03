import type { PropsWithChildren } from "@kitajs/html";

import { Navbar } from "../views/components/Navbar";
import { Sidebar } from "../views/components/Sidebar";

type Props = PropsWithChildren<{
  title?: string;
  heading?: string;
}>;

export const BaseLayout = async ({
  title = "E9 - Arbitmage",
  heading,
  children,
}: Props) => {
  return (
    <>
      {`<!DOCTYPE html>`}
      <html lang="en" data-theme="dark">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title safe>{title}</title>
          <link rel="icon" href="/public/favicon.ico" />

          <link href="/public/css/styles.css" rel="stylesheet" />

          <script src="/public/js/htmx.min.js"></script>
          <script src="/public/js/hyperscript.min.js"></script>
          <script src="/public/js/lucide.js"></script>
          <script src="/public/js/theme-change.js"></script>

          <script src="/public/dist/scripts.js"></script>
          <script src="/public/dist/notification-toast.js"></script>
        </head>
        <body
          hx-indicator=".progress"
          class="bg-base-200 text-base-content antialiased"
        >
          <a
            href="#main-content"
            class="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-base-100 focus:px-4 focus:py-2 focus:shadow-lg"
          >
            Skip to content
          </a>

          <div id="app-drawer" class="drawer lg:drawer-open">
            <input id="left-drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-side z-30">
              <label
                for="left-drawer"
                class="drawer-overlay"
                aria-label="Close menu"
              ></label>
              <Sidebar />
            </div>

            <div class="drawer-content flex min-h-screen flex-col">
              <progress class="progress w-full"></progress>
              <Navbar heading={heading} />
              <main
                id="main-content"
                class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
              >
                {children}
              </main>
              <footer class="footer footer-center sm:footer-horizontal border-t border-base-300 bg-base-100 px-4 py-6 text-sm text-base-content/70">
                <aside>
                  <p>
                    Copyright © BedokCorp {new Date().getFullYear()} · Built by{" "}
                    <a
                      class="link link-hover font-medium"
                      href="https://sulthonuladib.dev"
                    >
                      Sulthonul Adib
                    </a>
                  </p>
                </aside>
              </footer>
            </div>
          </div>

          <div id="toast-container" class="toast toast-end toast-bottom z-50"></div>
        </body>
      </html>
    </>
  );
};
