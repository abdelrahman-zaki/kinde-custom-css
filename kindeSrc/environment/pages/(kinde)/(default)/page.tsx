"use server";

import React from "react";
import { renderToString } from "react-dom/server.browser";
import {
  type KindePageEvent,
  getKindeRequiredCSS,
  getKindeRequiredJS,
  getKindeNonce,
  getKindeWidget,
  getKindeCSRF,
  getLogoUrl,
  getSVGFaviconUrl,
  getKindeThemeCode
} from "@kinde/infrastructure";

const Layout = async ({request, context}) => {
  return (
    <html lang={request.locale.lang} dir={request.locale.isRtl ? "rtl" : "ltr"} data-kinde-theme={getKindeThemeCode()}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="csrf-token" content={getKindeCSRF()} />
        <title>{context.widget.content.page_title}</title>

        <link rel="icon" href={getSVGFaviconUrl()} type="image/svg+xml" />
        {getKindeRequiredCSS()}
        {getKindeRequiredJS()}
        <style nonce={getKindeNonce()}>
          {`
            :root {
                --kinde-base-font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
                --kinde-card-background-color: yellow;
            }

            @media screen and (prefers-color-scheme: dark) {
              :root[data-kinde-theme=user-preference] {
                --kinde-card-background-color: red;
              }
            }

            :root[data-kinde-theme=dark] {
              --kinde-card-background-color: red;
            }

            #root,
            .kinde-card-container,
            .kinde-card-logo-container {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            #root {
              min-height: 100%;
              justify-content: center;
            }

            .kinde-card-container {
              padding: 3rem;
            }

            .kinde-card {
              max-width: 496px;
              width: 100%;
              padding: 3rem;
              display: flex;
              flex-direction: column;
              border-radius: 16px;
              background-color: var(--kinde-card-background-color);
            }

            .kinde-card-logo {
              width: 120px;
              margin-bottom: 3rem;
            }

            .kinde-card-heading {
              font-weight: 500;
              font-size: 1.5rem;
              margin-bottom: 0.6rem;
            }

            .kinde-card-description {
              font-weight: 400;
              font-size: 1rem;
              margin-bottom: 1.5rem;
            }
          `}
        </style>
      </head>
      <body>
        <div data-kinde-root="/admin" id="root">
          <div className="kinde-card-container">
            <main className="kinde-card">
              <div className="kinde-card-logo-container">
                <img className="kinde-card-logo" src={getLogoUrl()} alt={context.widget.content.logo_alt} />
              </div>
              <h1 className="kinde-card-heading">{context.widget.content.heading}</h1>
              <p className="kinde-card-description">{context.widget.content.description}</p>
              {getKindeWidget()}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
};

export default async function Page(event: KindePageEvent): Promise<string> {
  const page = await Layout({...event});
  return renderToString(page);
}